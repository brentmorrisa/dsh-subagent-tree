# AGENTS.md — working on dsh-subagent-tree

Operational knowledge for agents (and humans) building, editing, installing,
and validating this plugin. Read this before touching `index.js` or
`client.js`.

## What this repo is

One npm package that hosts the **Subagent tree panel** as a permanent Cordis
plugin for a DeepSeek Harness (DSH) runtime. There is no build step and no
bundler: the committed files ARE the artifacts. `client.js` in particular is
hand-authored in the client module system's lazy factory-CJS form — it is
source and artifact at once. Do not "compile" it, do not convert it to ESM,
and do not replace `React.createElement` with JSX.

```
package.json   package manifest; binds the two halves (see dsh.client)
index.js       HOST half  — runs in the DSH Node process
client.js      BROWSER half — runs in the web GUI page
```

### package.json mechanics (verified against the running harness)

- `main: ./index.js` — the profile loader imports this for the host half.
  The module must export `inject` (array of service names) and `apply(ctx)`.
- `exports["./client"]` + `"dsh": { "client": { platform: "web", … } }` — the
  client module system discovers client bundles ONLY through this pair
  (`require.resolve('<name>/package.json')` + `exports["./client"]`). A
  composition row can never deliver a browser half without them.
- `dsh.client.platform` must stay `"web"`. `immediately: true` makes the shell
  prefetch the bundle at boot.
- `exports` MUST also expose `"./package.json": "./package.json"`. The client
  module system discovers client bundles by
  `require.resolve('<name>/package.json')` from the profile anchor; Node's
  exports gating makes that lookup throw for any subpath the map does not
  list, and the scanner swallows the failure as a silent "not a client
  package" verdict: the HOST half mounts (plugin inventory looks normal) but
  the browser half never reaches the page. The verdict is cached
  process-lifetime — fixing the exports requires a DSH restart.

## Install targets (deploy frequency: low)

- **Package home:** `<DSH_HOME>/profiles/desktop/node_modules/dsh-subagent-tree/`
  where `<DSH_HOME>` is `$DSH_HOME` (normally `%USERPROFILE%\.dsh`). The
  desktop app reserves the single `desktop` profile: it refuses to boot or
  dump config for it, and only the `plugin` subcommand is allowed — through
  the app's own launcher, which passes the desktop flag that permits it. There
  is **no `dsh` on `PATH`**; on Windows the launcher is
  `"%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd"`,
  so deploy with
  `<launcher> plugin --profile desktop add <this-repo-path>`. pnpm installs
  from the repo, and the package's `dsh.bundle.patch` makes that command
  self-wire the composition row into the profile's bundle layer list. With a
  local path spec, pnpm records a `link:` dependency:
  `node_modules/dsh-subagent-tree` is a live junction to this repo, so no sync
  step exists locally. Registry or git-spec installs (what GitHub users get)
  materialize copies. A manual copy deploy remains possible (README fallback)
  but then needs the manual row below.
- **Composition row (manual fallback only):** one entry in
  `<DSH_HOME>/profiles/desktop/cordis.patch.yml`:

  ```yaml
  - insert:
    - name: dsh-subagent-tree
  ```

  Never let this co-exist with the bundle form on one profile — double
  insertion double-mounts the panel and throws `webserver: duplicate exact
  route "/sgtree/snapshot"` at boot.
- **Activation:** a newly added bundle row usually hot-applies its host half,
  but an edit to `index.js` needs a full app restart, and a client-bundle
  change needs a page reload (the boot graph re-hashes at process start).

**Development loop (this profile's dependency is a live `link:`):** edit the
repo → reload the page for `client.js`, restart the app for `index.js`. The
junction makes the repo the installed copy; no sync step is needed. A registry
or git-spec install would be snapshotted — relevant only if someone edits
against a copied install. `node --check` runs from the repo directly.

### Bundle form (adopted)

The package declares `"dsh": { "bundle": { "patch": "lib/patch.yml" } }` and
ships its insert row inside itself, so `dsh plugin --profile desktop add
<github or path spec>` installs AND composes on any profile in one command. The patch
file shares the profile patch grammar (`insert:` lists, id-targeted config
overrides, disables). Publishing notes: `private` is intentionally absent;
`files` whitelists `index.js`, `client.js`, `lib/patch.yml` (README, LICENSE,
and package.json are always packed); git-spec installs need no `prepare`
script because there is no build. If a profile previously received the manual
row, remove it before enabling the bundle form (warning above).

## Validation checklist (run after every edit)

1. `node --check index.js` and `node --check client.js` (run from the package
   directory so `type: module` is honored for the ESM file).
2. `node --input-type=module -e "const m = await
   import('<abs>/index.js'); console.log(m.inject, typeof m.apply)"`.
3. `npm test` (`node --test`) — the formatter suite in `test/` must pass.
   It is Node-only and offline.
4. Composition check — `--dump-config` is **refused for the `desktop`
   profile** by design. Either install into a throwaway non-desktop profile and
   run `dsh --profile <scratch> --dump-config` (must name `dsh-subagent-tree`
   exactly once and warn nothing), or probe the running app:
   `GET http://127.0.0.1:<port>/sgtree/snapshot?rootId=<sessionId>` must answer
   JSON carrying `revision`; 404 means the host half did not activate.
5. After deploy + restart + refresh: host console marker
   `[sgtree] host half ready: /sgtree/snapshot route registered`; browser
   devtools marker `[sgtree] client half ready`; a "Subagents" capsule appears
   in the session header immediately left of "Session log". Clicking it opens
   the `Subagents` tab in the right sidebar and reveals the column; clicking it
   again collapses the column and leaves the tab in the strip; the tab's ✕
   closes it and the next click opens a fresh one.

## Hard constraints (breaking these breaks silently or loudly)

- **Client bundle identity:** the registered id inside `client.js`
  (`window.__ModuleLoader__.load({ id: '…', factory })`) must equal the
  package name and the composition row name exactly (`dsh-subagent-tree`).
  A mismatch is a loud boot throw.
- **Plain JS only.** No TypeScript, JSX, or import transform anywhere.
  React UI is `React.createElement`. The only allowed `require` in the
  factory is `react` (the shell's static module table registers it; other
  client-ui packages would additionally require their own graph rows).
- **Lossless JSON at the route.** The host snapshot handler answers
  `JSON.stringify` of plain data only; service/event objects are internal
  live data — copy only the leaf fields needed (the `cleanOf` helper strips
  `undefined`, keep it on every constructed payload object, including the
  top-level success shape).
- **`window` timers are fine in the static client** (unlike dynamic Cordis
  packages); the 2 s poll is a busy-guarded `window.setInterval` whose
  disposer lives in the React effect cleanup and `ctx.effect` ownership.
- **Host half services:** hard inject `['subagents', 'webServer']`; optional
  services (`agents`, `sessionQuery`) MUST be re-read per request with
  `ctx.get` (they can mount after this row applies; a one-time capture at
  apply-time can freeze as `undefined`).
- **Client half services:** inject `['sessions', 'slots', 'uiWorkspace',
  'sidebarRight', 'sidebarRightTabs']`. `uiWorkspace.selection` is the fallback
  source of the current session when a slot gives no `sessionId`; the tab body
  is session-scoped and takes its own `sessionId` prop, so prefer that.
  Navigation is `uiWorkspace.openSession(idOrAddress)`, and a stale address is
  refreshed with `sessions.refreshProjections(parentId)`. The tab is opened by
  kind with `sidebarRight.openTab(...)`; state reads use `tabsIn(sessionId)`,
  `isExpanded()` and `toggleExpanded()`.
- **Route registration** goes through `ctx.webServer.register({ kind: 'exact',
  path: '/sgtree/snapshot', handler })` inside `ctx.effect(...)` so the row
  is unregistered when the effect disposes. Handler signature is Node raw
  `(req, res)`; the handler takes over the response (`writeHead`/`end`).
- Never edit shipped preset or bundle installs inside the app checkout
  (`...\node_modules\@deepseek-ai\...`) to fix this package; the package and
  the profile patch file are the only edit surfaces.
- The exports-gated manifest lookup (`./package.json`) is this package's
  loudest silent failure mode — see the package.json mechanics section.
  Signature symptom: host mounted, plugin visible in settings, no panel or
  opener anywhere on the page.

## Behavior contract (user-approved; preserve across refactors)

Client-side, these are deliberate; do not "clean them up":

- Root row label `Session - <ProjectName>` (workspace basename — NOT an LLM
  call); downward-opening tooltip at the root (it sits at the tab's top edge).
  There is **no panel title bar**: the dock tab titled `Subagents` is the only
  chrome above the tree.
- Badges: `direct/total` on every section; a single number when the counts
  are equal; inverted light chip on row hover (the badge hover must be
  visible on dark backgrounds).
- Context ring: 14×14 viewBox, R=5.5, `rotate(-90 7 7)`, dasharray
  `C*pct/100 ' ' C`, track `border-l3`, fill `label-tertiary`; tooltip text
  `N% of context used` (a space after `%`) plus `~used / window` tokens
  formatted by `formatTokens` — `12.5k`, `128k`, `1m`, `1.5m`; a `.0` fraction
  is dropped, and 999.5k rolls to `1m` rather than printing `1000k`;
  18 px ringslot reserved at the right edge even when the ring is absent;
  an always-present meter/count line at the panel's right edge.
- Panel surface (the dark theme is the reference): body `bg-layer-1`, the root
  row a 5 % mix of `label-primary` over the body, hover `interactive-bg-hover`,
  badge chip 9 %, tooltip an **opaque** 12 % "raised" surface. Never paint the
  panel with `bg-overlay` (it is the lightest surface in the dark theme, and
  the panel is meant to sit near the app background), never give a floating
  surface the translucent `--dsw-specific-menu` token (94 % alpha shows the
  panel through it), and never use a `border-*` alpha as ink — the
  chevron-slot placeholder (`•`/`○`) was invisible for exactly that reason and
  is now `label-tertiary`.
- Dots: solid grey for finished and for recent finishers
  (`label-secondary`); `inactive` is a 1.5 px hollow `label-secondary` ring at
  full opacity; the working dot pulses opacity 1 → 0.6 (never → 0.35, which
  blended into the panel). `Finished [X]` rows single-level indented at the top
  of their section; revealed subtrees render collapsed;
  `X` = that session's hidden finished count.
- Finished threshold: 10 minutes (`RECENT_MS`). Resident `idle` agents drain to
  Finished after `IDLE_STALE_MS` = 2 min via the `agent/status` idle map — the
  event payload carries the agent because the loop dispatches through
  `agentEvents`, whose `fused()` spreads `{ ...payload, agent }`. When no stamp
  exists (agent already idle at mount, or a build that omits the identity) the
  host stamps on first observation instead, and prunes stamps for agents that
  are gone. Note that in the desktop build a finished or interrupted child
  disposes its agent, so this grace is mostly the root's.
  End stamps are first-seen-only (`subagent/end` repeatedly per run/epoch —
  never let a repeat re-pin "recent").
- Running mode (footer toggle): auto-expand while any descendant is live,
  auto-collapse when none is; 10 s client-observed finisher linger;
  diagnostics and Finished rows hidden; chevrons inert while on. Empty-state
  text is exactly `No running subagents.` in BOTH modes — one unconditional
  string, per user preference (no onboarding copy).
- MAX_ROWS 500 cap with a visible truncation note.
- **Docked tab, not a floating window.** The tree is a right-sidebar tab: a tab
  type registered through `sidebarRightTabs`, with its body under the keyed
  `sidebar.right.pane.tab` seat (`key` = the type id). There is no drag, no
  resize handle, no geometry state and no ✕ of our own — the dock owns sizing,
  splitting, layout persistence and closing. Do not reintroduce `shell.overlay`.
- **One opener, and it toggles.** The `conversation.session.header.utilities`
  capsule (`sgtree-header`, `order: -1`, label `Subagents`) is the only opener;
  the old `sidebar.footer.action` button is gone. Its behaviour, in the user's
  terms: **no tab** → open it and reveal the column; **tab present and column
  showing** → collapse the column (`toggleExpanded`) and KEEP the tab; **tab
  present and column hidden** → `openTab`, which reveals it. Closing the tab is
  the tab's own ✕, never this button. No pressed/active indicator is required
  (plain toggle, read state at click time).
- The capsule is content-sized: 32 px tall, 18 px radius, `.sgp-headerbtn`, with
  **no `min-width`** — the old 111 px floor existed to match the Session log
  capsule and only left dead space once the label became `Subagents`.
- No refresh button and no "2s refresh" caption: the 2 s poll is the only
  refresh path.

## Repo hygiene

- No build system: nothing to regenerate. `npm test` (`node --test`) runs the
  offline suite in `test/`; it loads `client.js` through a stubbed
  `window.__ModuleLoader__` and reaches the pure formatter via the
  `__formatTokens` seam on the plugin object (a test seam, not plugin
  contract). CI should run that plus the validation checklist. `test/` is
  deliberately outside the `files` whitelist, so it never ships in the tarball.
- Do not commit the installed copies under `%USERPROFILE%\.dsh` (user data).
- The `sgtree` dynamic Cordis plugin in live sessions was the authoring
  vehicle; its definitions die with the process by design. Do not add it
  back; this repo supersedes it.
