// dsh-subagent-tree — host half.
// Static profile plugin: builds the subagent tree snapshot the browser panel
// polls, from host services the browser cannot reach (subagents registry,
// agents, sessionQuery). Served over a plain GET route; lossless JSON in,
// lossless JSON out (cleanOf strips undefined keys exactly as the dynamic
// package's cloneJson boundary demanded).

export const inject = ['subagents', 'webServer'];

export function apply(ctx) {
  const subagents = ctx.subagents;

  let revision = 0;
  const titleCache = new Map();
  const endMap = new Map();
  const idleMap = new Map();
  const TITLE_TTL = 30000;
  const PENDING_TTL = 3000;
  const RECENT_MS = 10 * 60 * 1000;
  const IDLE_STALE_MS = 2 * 60 * 1000;

  const cleanOf = function (obj) {
    const out = {};
    for (const key in obj) {
      if (obj[key] !== undefined) out[key] = obj[key];
    }
    return out;
  };

  ctx.on('subagent/start', function () { revision += 1 });
  ctx.on('subagent/end', function (info) {
    try {
      if (info && info.id) {
        const key = String(info.id);
        if (!endMap.has(key)) endMap.set(key, Date.now());
      }
    } catch (err) {}
    revision += 1;
  });
  ctx.on('agent/status', function (payload) {
    try {
      if (payload && payload.agent && payload.agent.id) {
        const key = String(payload.agent.id)
        if (payload.status === 'idle') idleMap.set(key, Date.now());
        else if (idleMap.has(key)) idleMap.delete(key);
      }
    } catch (err) {}
    revision += 1;
  });

  ctx.effect(function () {
    return ctx.webServer.register({
      kind: 'exact',
      path: '/sgtree/snapshot',
      handler: async function (req, res) {
        let payload;
        try {
          // Read optional services per request: they may mount after this row
          // applies, and ctx.get is a plain lookup each call.
          const agentsSvc = ctx.get('agents');
          const sessionQuery = ctx.get('sessionQuery');
          const url = new URL(req.url === undefined ? '/' : String(req.url), 'http://x');
          const rootIdRaw = url.searchParams.get('rootId');
          if (rootIdRaw === undefined || rootIdRaw === null || rootIdRaw === '') {
            payload = { revision: revision, error: 'rootId required' };
          } else {
            payload = await buildSnapshot(String(rootIdRaw), agentsSvc, sessionQuery);
          }
        } catch (err) {
          payload = { revision: revision, error: String((err && err.message) || err) };
        }
        res.writeHead(200, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-cache',
        });
        res.end(JSON.stringify(payload));
      }
    });
  });

  // Same snapshot builder as the dynamic package, verbatim logic.
  async function buildSnapshot(rootId, agentsSvc, sessionQuery) {
    const now = Date.now();

    let entries;
    try {
      entries = await subagents.listDescendants(rootId);
    } catch (err) {
      return { revision: revision, error: String((err && err.message) || err) };
    }

    const liveStatus = new Map();
    if (agentsSvc !== undefined) {
      try {
        const live = agentsSvc.list();
        for (const agent of live) {
          if (agent && agent.id) {
            const key = String(agent.id);
            if (agent.status === 'running') {
              liveStatus.set(key, 'working');
            } else if (agent.status === 'idle') {
              const lastIdle = idleMap.get(key);
              liveStatus.set(key, (lastIdle !== undefined && (now - lastIdle) < IDLE_STALE_MS) ? 'idle' : 'inactive');
            } else {
              liveStatus.set(key, 'inactive');
            }
          }
        }
      } catch (err) {
        console.error('[sgtree] agent list failed', err);
      }
    }

    const wantIds = [String(rootId)];
    for (const entry of entries) {
      const eid = String(entry.id);
      if (wantIds.indexOf(eid) < 0) wantIds.push(eid);
    }

    const titles = new Map();
    if (sessionQuery !== undefined) {
      const missing = [];
      for (const sid of wantIds) {
        const hit = titleCache.get(sid);
        const ttl = (hit !== undefined && hit.title === undefined) ? PENDING_TTL : TITLE_TTL;
        if (hit !== undefined && now - hit.at < ttl) {
          titles.set(sid, hit.title);
        } else {
          missing.push(sid);
        }
      }
      if (missing.length > 0) {
        try {
          const results = await sessionQuery.readTitleSnapshots(missing);
          for (const result of results) {
            const sid = String(result.sessionId);
            let title;
            if (result.status === 'fulfilled' && result.value && result.value.title) {
              title = result.value.title.title;
            }
            titleCache.set(sid, { title: title, at: now });
            titles.set(sid, title);
          }
        } catch (err) {
          console.error('[sgtree] title read failed', err);
        }
      }
    }

    const nodes = [];
    for (const entry of entries) {
      const eid = String(entry.id);
      const liveNow = liveStatus.get(eid);
      if (entry.kind === 'child') {
        nodes.push(cleanOf({
          id: eid,
          parentId: String(entry.parentId),
          depth: entry.depth,
          kind: 'child',
          mode: entry.mode === undefined ? undefined : String(entry.mode),
          label: entry.label === undefined ? undefined : String(entry.label),
          title: titles.get(eid) === undefined ? undefined : String(titles.get(eid)),
          status: liveNow || 'inactive',
          hasChildren: entry.hasChildren === true,
          recentDone: liveNow === undefined
            && endMap.has(eid)
            && (now - endMap.get(eid)) < RECENT_MS,
        }));
      } else {
        nodes.push(cleanOf({
          id: eid,
          parentId: String(entry.parentId),
          depth: entry.depth,
          kind: 'diagnostic',
          reason: entry.reason === undefined ? undefined : String(entry.reason),
          status: entry.reason === 'unavailable' ? 'unavailable' : 'corrupt',
          hasChildren: false,
          recentDone: false,
        }));
      }
    }

    return {
      revision: revision,
      root: cleanOf({
        id: String(rootId),
        status: liveStatus.get(String(rootId)) || 'inactive',
        title: titles.get(String(rootId)) === undefined ? undefined : String(titles.get(String(rootId))),
      }),
      nodes: nodes,
    };
  }

  console.log('[sgtree] host half ready: /sgtree/snapshot route registered');
}
