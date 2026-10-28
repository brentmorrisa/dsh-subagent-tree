// dsh-subagent-tree — browser half.
// Factory-form CJS bundle for the client module system: executing this file
// only registers the factory; the body runs at materialization. The exported
// plugin is a verbatim port of the dynamic sgtree plugin's client half with
// four adaptations to the static runtime: React comes from the static module
// table, CSS rides a <style> element instead of styles.insert, the 2s poll
// rides window.setInterval (window timers are legal in static packages), and
// host.call("sgtree.snapshot") became a plain GET to /sgtree/snapshot.

window.__ModuleLoader__.load({
  id: 'dsh-subagent-tree',
  factory: function (require) {
    const React = require('react')

    const CSS =
`.sgp-headerbtn{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2);height:32px;padding:6px 12px;border-radius:18px;background:transparent;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);font-size:13px;font-weight:400;line-height:20px;cursor:pointer}
.sgp-headerbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sgp-headerbtn span{white-space:nowrap}
.sgp-tab{display:flex;flex-direction:column;height:100%;min-height:0;overflow:hidden;background:var(--dsw-alias-bg-layer-1);--sgp-lift:color-mix(in srgb,var(--dsw-alias-label-primary) 5%,var(--dsw-alias-bg-layer-1));--sgp-chip:color-mix(in srgb,var(--dsw-alias-label-primary) 9%,var(--dsw-alias-bg-layer-1));--sgp-raised:color-mix(in srgb,var(--dsw-alias-label-primary) 12%,var(--dsw-alias-bg-layer-1))}
.sgp-body{flex:1;min-height:0;overflow:auto;padding:5px 4px 8px}
.sgp-row{display:flex;align-items:center;gap:6px;height:25px;border-radius:6px;cursor:pointer;padding-right:4px;color:var(--dsw-alias-label-primary)}
.sgp-row:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sgp-rootrow{font-weight:600;margin-bottom:3px;background:var(--sgp-lift)}
.sgp-current{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
.sgp-chev{width:18px;height:20px;flex:none;cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:11px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.sgp-chev:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.sgp-chev-empty{cursor:default;color:var(--dsw-alias-label-tertiary)}
.sgp-chev-empty:hover{background:transparent;color:var(--dsw-alias-label-tertiary)}
.sgp-dot{width:8px;height:8px;border-radius:50%;flex:none}
.sgp-sdot-working{background:var(--dsw-alias-state-success-primary)}
.sgp-sdot-idle{background:var(--dsw-alias-brand-primary);opacity:.9}
.sgp-sdot-inactive{background:transparent;box-shadow:inset 0 0 0 1.5px var(--dsw-alias-label-secondary);opacity:1}
.sgp-sdot-recent{background:var(--dsw-alias-label-secondary)}
.sgp-sdot-fin{background:var(--dsw-alias-label-secondary)}
.sgp-sdot-corrupt,.sgp-sdot-unavailable{background:var(--dsw-alias-state-error-primary)}
.sgp-anim-working{animation:sgp-pulse 1.5s ease-in-out infinite}
@keyframes sgp-pulse{0%,100%{opacity:1}50%{opacity:.6}}
.sgp-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1;font-size:12.5px}
.sgp-diag{color:var(--dsw-alias-label-secondary);text-decoration:line-through}
.sgp-chip{flex:none;font-size:10px;padding:1px 6px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.sgp-ringwrap{position:relative;width:18px;height:18px;flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;cursor:default}
.sgp-ringwrap:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sgp-ringslot{flex:none;width:18px;height:1px}
.sgp-ring{display:block}
.sgp-ring-track{fill:none;stroke:var(--dsw-alias-border-l3);stroke-width:2px}
.sgp-ring-fill{fill:none;stroke:var(--dsw-alias-label-tertiary);stroke-width:2px;stroke-linecap:round}
.sgp-rtip{position:absolute;bottom:calc(100% + 6px);right:-3px;z-index:100;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--sgp-raised);box-shadow:0 10px 28px rgba(0,0,0,.45);color:var(--dsw-alias-label-secondary);cursor:default;border-radius:10px;padding:6px 10px;font-size:12px;line-height:18px;white-space:nowrap;pointer-events:none;display:flex;align-items:baseline}
.sgp-rtip-below{bottom:auto;top:calc(100% + 6px)}
.sgp-rtip-pct{color:var(--dsw-alias-label-primary);font-weight:500}
.sgp-rtip-rest{margin-left:3px}
.sgp-rtip-fig{margin-left:10px;padding-left:10px;border-left:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-weight:500}
.sgp-subcount{flex:none;font-size:10.5px;min-width:16px;text-align:center;color:var(--dsw-alias-label-secondary);background:var(--sgp-chip);border-radius:999px;padding:1px 6px}
.sgp-row:hover .sgp-subcount{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1)}
.sgp-finrow{color:var(--dsw-alias-label-secondary);font-weight:600}
.sgp-note{padding:14px 16px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}
.sgp-footerline{display:flex;align-items:center;gap:6px;border-top:1px solid var(--dsw-alias-border-l1);padding:4px 10px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden}
.sgp-errmsg{color:var(--dsw-alias-state-error-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sgp-runbtn{display:inline-flex;align-items:center;gap:5px;flex:none;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:11px;padding:2px 8px;border-radius:999px;white-space:nowrap}
.sgp-runbtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}
.sgp-runbtn.sgp-runbtn-on{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.sgp-runbtn .sgp-runbtn-dot{width:7px;height:7px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px var(--dsw-alias-label-secondary)}
.sgp-runbtn.sgp-runbtn-on .sgp-runbtn-dot{background:var(--dsw-alias-state-success-primary);box-shadow:none}
`

    // Browser-network face of the snapshot: replaces the dynamic plugin's
    // host.call("sgtree.snapshot", ...) with a same-origin GET.
    const snapshotOf = function (rootId) {
      return fetch('/sgtree/snapshot?rootId=' + encodeURIComponent(String(rootId)))
        .then(function (resp) {
          if (!resp.ok) throw new Error('snapshot request failed: HTTP ' + resp.status)
          return resp.json()
        })
    }

    // Token counts for the context tooltip. One decimal below 100k and for
    // millions, whole numbers from 100k up; a trailing ".0" is dropped, so the
    // decimal appears only when the fraction is non-zero: 999 -> "999",
    // 12500 -> "12.5k", 128000 -> "128k", 1048576 -> "1m", 1500000 -> "1.5m".
    // The 999.5k boundary rolls into millions rather than printing "1000k".
    // Exposed on the plugin object as `__formatTokens` so test/ can exercise
    // it without a browser; it is not part of the plugin contract.
    const trimZero = function (s) {
      return s.endsWith('.0') ? s.slice(0, -2) : s
    }
    const formatTokens = function (v) {
      if (!isFinite(v)) return '?'
      if (v >= 1000000) return trimZero((v / 1000000).toFixed(1)) + 'm'
      if (v >= 1000) {
        const k = v / 1000
        if (Math.round(k) >= 1000) return trimZero((v / 1000000).toFixed(1)) + 'm'
        if (Math.round(k) >= 100) return String(Math.round(k)) + 'k'
        return trimZero((Math.round(k * 10) / 10).toFixed(1)) + 'k'
      }
      return String(Math.round(v))
    }

    // Right-sidebar tab identity. The tab type `id` is also the key of the
    // body registration under `sidebar.right.pane.tab`; the `kind` is what
    // `sidebarRight.openTab()` names.
    const TAB_ID = 'dsh-subagent-tree'
    const TAB_KIND = 'sgtree'

    return {
      inject: ['sessions', 'slots', 'uiWorkspace', 'sidebarRight', 'sidebarRightTabs'],
      apply: function (ctx) {
        const slots = ctx.get('slots')
        if (slots === undefined) return

        const styleEl = document.createElement('style')
        styleEl.setAttribute('data-plugin', 'dsh-subagent-tree')
        styleEl.textContent = CSS
        ctx.effect(function () {
          document.head.appendChild(styleEl)
          return function () {
            styleEl.remove()
          }
        }, 'subagent-tree: css')

        // Header capsule toggle, in the user's terms:
        //   - no subagents tab  -> open it and reveal the column
        //   - tab present, column showing -> collapse the column, KEEP the tab
        //   - tab present, column hidden  -> openTab, which reveals the column
        //     and refocuses the existing tab
        // Closing the tab is the tab's own ✕, never this button.
        const toggleTree = function (sessionId) {
          const sidebar = ctx.get('sidebarRight')
          if (sidebar === undefined || typeof sidebar.openTab !== 'function') return
          try {
            const tabs = typeof sidebar.tabsIn === 'function' && sessionId !== undefined
              ? sidebar.tabsIn(sessionId)
              : []
            let mine
            for (const tab of tabs || []) {
              if (tab !== undefined && tab !== null && tab.kind === TAB_KIND) { mine = tab; break }
            }
            const expanded = typeof sidebar.isExpanded === 'function' && sidebar.isExpanded() === true
            if (mine !== undefined && expanded === true && typeof sidebar.toggleExpanded === 'function') {
              sidebar.toggleExpanded()
              return
            }
            sidebar.openTab(TAB_KIND)
          } catch (err) {}
        }

        // Per-session UI state (collapsed sections, Finished filters, Running
        // mode) plus the snapshot cache. Both live here rather than inside the
        // component so a session swap — which remounts the tab body — restores
        // what the user left behind instead of resetting it.
        const uiStates = new Map()
        const uiStateFor = function (key) {
          let state = uiStates.get(key)
          if (state === undefined) {
            state = { collapsed: {}, showFin: {}, runningMode: false }
            uiStates.set(key, state)
          }
          return state
        }
        const snapshotCache = new Map()

        const firstText = function (a, b, c) {
          if (a !== undefined && a !== null && a !== '') return a
          if (b !== undefined && b !== null && b !== '') return b
          return c
        }
        const shortId = function (id) {
          const total = String(id)
          if (total.length <= 14) return total
          return total.slice(0, 6) + '…' + total.slice(-4)
        }
        const projectNameOf = function (cwd) {
          if (cwd === undefined || cwd === null || cwd === '') return undefined
          const parts = String(cwd).split(/[\\/]+/)
          for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i] !== '') return parts[i]
          }
          return undefined
        }

        const RING_R = 5.5
        const RING_C = 2 * Math.PI * RING_R
        const occupancyOf = function (used, win) {
          if (!isFinite(used) || !(win > 0)) return undefined
          return {
            percent: Math.min(100, Math.max(0, Math.round(used / win * 100))),
            used: used,
            window: win,
          }
        }

        const CtxRing = function (propsRaw) {
          const occ = propsRaw && propsRaw.occ
          const below = propsRaw && propsRaw.below === true
          const hvPair = React.useState(false)
          const hover = hvPair[0]
          const setHover = hvPair[1]
          if (occ === undefined) return null
          return React.createElement('span', {
            className: 'sgp-ringwrap',
            title: '',
            onMouseEnter: function () { setHover(true) },
            onMouseLeave: function () { setHover(false) },
          },
            React.createElement('svg', {
              className: 'sgp-ring',
              viewBox: '0 0 14 14',
              width: '12',
              height: '12',
              'aria-hidden': true,
            },
              React.createElement('circle', { className: 'sgp-ring-track', cx: '7', cy: '7', r: String(RING_R) }),
              occ.percent >= 1 ? React.createElement('circle', {
                className: 'sgp-ring-fill',
                cx: '7', cy: '7', r: String(RING_R),
                strokeDasharray: String(RING_C * occ.percent / 100) + ' ' + String(RING_C),
                transform: 'rotate(-90 7 7)',
              }) : null,
            ),
            hover ? React.createElement('div', {
              className: 'sgp-rtip' + (below ? ' sgp-rtip-below' : ''),
              role: 'tooltip',
            },
              React.createElement('span', { className: 'sgp-rtip-pct' }, occ.percent + '%'),
              React.createElement('span', { className: 'sgp-rtip-rest' }, 'of context used'),
              React.createElement('span', { className: 'sgp-rtip-fig' }, '~' + formatTokens(occ.used) + ' / ' + formatTokens(occ.window)),
            ) : null,
          )
        }

        const Entry = function (propsRaw) {
          const useSessionsProp = propsRaw && propsRaw.useSessions
          // The tab body is rendered inside one session's right sidebar, so
          // that session is authoritative. The Workspace selection store stays
          // as the fallback for the header/footer openers' session.
          const tabSession = propsRaw && typeof propsRaw.sessionId === 'string' ? propsRaw.sessionId : undefined
          const selectionPair = React.useState(function () {
            const ws = ctx.get('uiWorkspace')
            const store = ws === undefined ? undefined : ws.selection
            return store === undefined ? {} : store.getSnapshot()
          })
          const selection = selectionPair[0]
          const setSelection = selectionPair[1]
          React.useEffect(function () {
            const ws = ctx.get('uiWorkspace')
            const store = ws === undefined ? undefined : ws.selection
            if (store === undefined) return undefined
            setSelection(store.getSnapshot())
            return store.subscribe(function () {
              setSelection(store.getSnapshot())
            })
          }, [])
          const current = tabSession !== undefined
            ? tabSession
            : (selection === undefined || selection === null ? undefined : selection.sessionId)

          const anchorState = React.useState(undefined)
          const anchor = anchorState[0]
          const setAnchor = anchorState[1]

          const anchorCwd = (typeof useSessionsProp === 'function')
            ? useSessionsProp(function (s) {
              if (anchor === undefined) return undefined
              const row = s.byId && s.byId[anchor]
              return row && row.cwd ? row.cwd : undefined
            })
            : undefined
          const projectOf = projectNameOf(anchorCwd)

          const dataPairs = React.useState(undefined)
          const dataState = dataPairs[0]
          const setDataState = dataPairs[1]

          const errPair = React.useState(undefined)
          const error = errPair[0]
          const setError = errPair[1]

          // Collapsed sections, Finished filters and Running mode live OUTSIDE
          // the component, keyed by the watched session, because the dock
          // tears the tab body down whenever the user swaps sessions — any
          // useState here would silently reset on every switch. One render
          // counter forces the re-render the plain-object store cannot.
          const uiPair = React.useState(0)
          const bumpUi = uiPair[1]
          const ui = uiStateFor(anchor)
          const collapsed = ui.collapsed
          const showFin = ui.showFin
          const runningMode = ui.runningMode
          const setCollapsed = function (updater) {
            ui.collapsed = typeof updater === 'function' ? updater(ui.collapsed) : updater
            bumpUi(function (n) { return n + 1 })
          }
          const setShowFin = function (updater) {
            ui.showFin = typeof updater === 'function' ? updater(ui.showFin) : updater
            bumpUi(function (n) { return n + 1 })
          }
          const setRunningMode = function (updater) {
            ui.runningMode = typeof updater === 'function' ? updater(ui.runningMode) : updater
            bumpUi(function (n) { return n + 1 })
          }

          const cacheBox = snapshotCache
          // Ref on the tree root: the poller reads its visibility so a hidden
          // tab costs nothing (see `load`).
          const rootRef = React.useRef(null)

          const liveSeenBox = React.useState(function () { return new Map() })[0]
          const endObsBox = React.useState(function () { return new Map() })[0]
          const expirationPair = React.useState(0)
          const expiryTick = expirationPair[0]
          const setExpiry = expirationPair[1]

          const flagsBox = React.useState(function () { return { running: false } })[0]

          const snapPre = dataState && dataState.snapshot
          const wantedKey = (snapPre !== undefined) ? [String(snapPre.root.id)].concat(snapPre.nodes.map(function (n) { return String(n.id) })).join(',') : ''
          const pressureRaw = (typeof useSessionsProp === 'function')
            ? useSessionsProp(function (s) {
              const list = wantedKey !== '' ? wantedKey.split(',') : []
              if (list.length === 0) return ''
              const projections = s.projectionsBySession || {}
              let out = ''
              for (const id of list) {
                const row = projections[id]
                const p = (row !== undefined && row.values !== undefined) ? row.values.contextPressure : undefined
                if (p !== undefined) {
                  const used = (p.projectedTokens !== undefined && p.projectedTokens !== null) ? p.projectedTokens : p.pressureTokens
                  if (used !== undefined && used !== null && p.contextWindow !== undefined && p.contextWindow !== null && p.contextWindow > 0) {
                    out += id + '=' + used + '@' + p.contextWindow + ';'
                  }
                }
              }
              return out
            })
            : undefined
          const pressureMap = new Map()
          if (typeof pressureRaw === 'string' && pressureRaw !== '') {
            for (const seg of pressureRaw.split(';')) {
              const eq = seg.indexOf('=')
              if (eq < 0) continue
              const id = seg.slice(0, eq)
              const at = seg.indexOf('@')
              if (at < 0) continue
              const used = Number(seg.slice(eq + 1, at))
              const win = Number(seg.slice(at + 1))
              if (isFinite(used) && win > 0) pressureMap.set(id, occupancyOf(used, win))
            }
          }

          React.useEffect(function () {
            if (current === undefined) return
            setAnchor(function (prev) {
              if (prev === current) return prev
              if (prev === undefined) return current
              const snap = dataState && dataState.snapshot
              if (snap === undefined || snap.root === undefined) return prev
              if (current === snap.root.id) return prev
              for (const n of snap.nodes) {
                if (n.id === current) return prev
              }
              return current
            })
          }, [current, dataState])

          React.useEffect(function () {
            setError(undefined)
            liveSeenBox.clear()
            endObsBox.clear()
            const cached = cacheBox.get(anchor)
            if (cached !== undefined) setDataState(cached)
            else setDataState(undefined)
          }, [anchor])

          // No collapse/showFin reset on anchor change: that state is keyed by
          // session in `uiStates`, so swapping sessions restores it. The old
          // reset here is what silently cleared it on every switch.

          React.useEffect(function () {
            if (anchor === undefined) return
            let cancelled = false
            let busy = false
            const load = function () {
              if (busy === true) return
              // Do no work at all while the tree cannot be seen: the dock host
              // is `visibility:hidden` when the column is collapsed, the pane
              // is hidden, or the window is minimised/backgrounded. The timer
              // keeps ticking (a no-op) so revealing the column resumes on the
              // next tick without any subscription or teardown.
              if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
              const el = rootRef.current
              if (el !== null && el !== undefined && typeof el.checkVisibility === 'function'
                && el.checkVisibility({ visibilityProperty: true }) === false) return
              busy = true
              snapshotOf(anchor)
                .then(function (payload) {
                  busy = false
                  if (cancelled) return
                  if (payload && payload.error) {
                    setError(String(payload.error))
                    return
                  }
                  setError(undefined)
                  const json = JSON.stringify(payload)
                  const packed = { json: json, snapshot: { root: payload.root, nodes: payload.nodes || [] } }
                  setDataState(function (prev) {
                    if (prev !== undefined && prev.json === json) return prev
                    return packed
                  })
                  if (cacheBox.get(anchor) === undefined || cacheBox.get(anchor).json !== json) {
                    cacheBox.set(anchor, packed)
                    if (cacheBox.size > 8) {
                      const oldest = cacheBox.keys().next()
                      if (!oldest.done) cacheBox.delete(oldest.value)
                    }
                  }
                  if (flagsBox.running === true) {
                    let pending = false
                    endObsBox.forEach(function (t) {
                      if (Date.now() - t < 10000) pending = true
                    })
                    if (pending === true) setExpiry(function (t) { return t + 1 })
                  }
                })
                .catch(function (err) {
                  busy = false
                  if (!cancelled) setError(String((err && err.message) || err))
                })
            }
            load()
            const timer = window.setInterval(load, 2000)
            return function () {
              cancelled = true
              window.clearInterval(timer)
            }
          }, [anchor])

          const selectAnchor = function () {
            if (anchor === undefined) return
            const ws = ctx.get('uiWorkspace')
            if (ws === undefined || typeof ws.openSession !== 'function') return
            try {
              ws.openSession(anchor)
            } catch (err) {}
          }

          const selectNode = function (n) {
            if (n.kind === 'diagnostic') return
            const sessions = ctx.get('sessions')
            const ws = ctx.get('uiWorkspace')
            if (ws === undefined || typeof ws.openSession !== 'function') return
            const address = { parentSessionId: n.parentId, childSessionId: n.id, mode: n.mode }
            try {
              ws.openSession(address)
            } catch (err) {
              try {
                // The address resolves from the parent's subagent catalog; a
                // just-started child may only become addressable after the
                // projection refresh lands.
                if (sessions !== undefined && typeof sessions.refreshProjections === 'function') {
                  sessions.refreshProjections(n.parentId).then(function () {
                    try { ws.openSession(address) } catch (err2) {}
                  })
                }
              } catch (err3) {}
            }
          }

          const toggleNode = function (id, defaultVal) {
            setCollapsed(function (prev) {
              const next = {}
              for (const key in prev) next[key] = prev[key]
              const nowVal = (prev[id] !== undefined) ? prev[id] : (defaultVal === true)
              next[id] = !nowVal
              return next
            })
          }
          const toggleFin = function (pid) {
            setShowFin(function (prev) {
              const next = {}
              for (const key in prev) next[key] = prev[key]
              next[pid] = !prev[pid]
              return next
            })
          }

          flagsBox.running = runningMode

          const snap = snapPre

          const byParent = new Map()
          const liveCounts = new Map()
          const subCounts = new Map()

          if (snap !== undefined) {
            for (const n of snap.nodes) {
              const list = byParent.get(n.parentId)
              if (list === undefined) byParent.set(n.parentId, [n])
              else list.push(n)
            }

            const measure = function (pid) {
              let total = 0
              let live = 0
              const kids = byParent.get(pid) || []
              for (const k of kids) {
                const m = measure(k.id)
                const kLive = (k.status === 'working' || k.status === 'idle') ? 1 : 0
                subCounts.set(k.id, m.total)
                liveCounts.set(k.id, kLive + m.live)
                total += 1 + m.total
                live += kLive + m.live
              }
              return { total: total, live: live }
            }
            const rootMeasure = measure(snap.root.id)
            subCounts.set(snap.root.id, rootMeasure.total)
          }

          const rootSessionName = (projectOf !== undefined) ? ('Session - ' + projectOf) : undefined
          const rootName = firstText(rootSessionName, snap !== undefined ? snap.root.title : undefined, anchor !== undefined ? shortId(anchor) : undefined)
          const rootDetail = (rootName !== undefined ? rootName : '')
            + (snap !== undefined && snap.root.title !== undefined && snap.root.title !== rootName ? ' — ' + snap.root.title : '')
            + (anchor !== undefined ? ' — ' + anchor : '')

          const MAX_ROWS = 500
          const rows = []

          if (snap !== undefined) {
            for (const n of snap.nodes) {
              if (n.kind !== 'child') continue
              const selfLive = n.status === 'working' || n.status === 'idle'
              if (selfLive) {
                liveSeenBox.set(n.id, true)
                if (endObsBox.has(n.id)) endObsBox.delete(n.id)
              } else if (liveSeenBox.has(n.id) && !endObsBox.has(n.id)) {
                endObsBox.set(n.id, Date.now())
              }
            }

            const selfLiveOf = function (n) {
              if (n.kind !== 'child') return 0
              return (n.status === 'working' || n.status === 'idle') ? 1 : 0
            }
            const recentShort = function (n) {
              const observed = endObsBox.get(n.id)
              if (observed === undefined) return false
              return (Date.now() - observed) < 10000
            }
            const runCollapsedFor = function (n) {
              return !(selfLiveOf(n) === 1 || (liveCounts.get(n.id) || 0) > 0)
            }

            const visMap = new Map()
            const visOfNode = function (n) {
              const pid = String(n.id)
              const hit = visMap.get(pid)
              if (hit !== undefined) return hit
              let vis = false
              if (n.kind !== 'diagnostic' && (selfLiveOf(n) === 1 || recentShort(n))) {
                vis = true
              }
              if (vis === false) {
                const kids = byParent.get(pid) || []
                for (const k of kids) {
                  if (k.kind === 'diagnostic') continue
                  if (visOfNode(k) === true) {
                    vis = true
                    break
                  }
                }
              }
              visMap.set(pid, vis)
              return vis
            }

            const isHiddenFinished = function (n) {
              if (n.recentDone === true) return false
              if ((liveCounts.get(n.id) || 0) !== 0) return false
              return n.status === 'inactive' || n.kind === 'diagnostic'
            }

            const tailFor = function (n) {
              const occ = pressureMap.get(n.id)
              const totalCount = subCounts.get(n.id) || 0
              const directCount = (byParent.get(n.id) || []).length
              const sameCount = directCount === totalCount
              return [
                totalCount > 0 ? React.createElement('span', {
                  className: 'sgp-subcount',
                  title: sameCount === true
                    ? (totalCount + ' session' + (totalCount === 1 ? '' : 's') + ' under this section — all direct')
                    : (directCount + ' direct / ' + totalCount + ' total under this session'),
                }, sameCount === true ? String(totalCount) : (directCount + '/' + totalCount)) : null,
                occ !== undefined ? React.createElement(CtxRing, { occ: occ }) : React.createElement('span', { className: 'sgp-ringslot', 'aria-hidden': true }),
              ]
            }

            const toggleFor = function (pid, count, level) {
              const revealed = showFin[pid] === true
              return React.createElement('div', {
                key: 'sgp-fin-' + String(pid),
                className: 'sgp-row sgp-finrow',
                style: { paddingLeft: 6 + level * 18 },
                title: count + ' finished subagent session' + (count === 1 ? '' : 's') + ' under this session — click to ' + (revealed ? 'hide' : 'show'),
                onClick: function () { toggleFin(pid) },
              },
                React.createElement('span', {
                  className: 'sgp-chev',
                  onClick: function (e) {
                    e.stopPropagation()
                    toggleFin(pid)
                  },
                }, revealed ? '\u25BE' : '\u25B8'),
                React.createElement('span', { className: 'sgp-dot sgp-sdot-fin', title: 'finished' }),
                React.createElement('span', { className: 'sgp-name' }, 'Finished'),
                React.createElement('span', {
                  className: 'sgp-subcount',
                  title: count + ' finished sessions',
                }, String(count)),
                React.createElement('span', { className: 'sgp-ringslot', 'aria-hidden': true }),
              )
            }

            const walk = function (pid, level, underFinished) {
              if (rows.length >= MAX_ROWS) return
              const kids = byParent.get(pid) || []
              const revealed = showFin[pid] === true
              if (runningMode !== true) {
                let finCount = 0
                for (const k of kids) {
                  if (isHiddenFinished(k)) finCount += 1
                }
                if (finCount > 0 && underFinished !== true) rows.push(toggleFor(pid, finCount, level))
              }
              for (const n of kids) {
                if (rows.length >= MAX_ROWS) return
                const hiddenFinished = (runningMode === true) ? false : isHiddenFinished(n)
                if (runningMode === true) {
                  if (n.kind === 'diagnostic') continue
                  if (visOfNode(n) !== true) continue
                } else {
                  if (hiddenFinished === true && revealed !== true && underFinished !== true) continue
                }
                const isDiag = n.kind === 'diagnostic'
                const isCurrent = n.id === current
                const hasKids = n.kind === 'child' && n.hasChildren === true
                const defaultCollapsed = hiddenFinished === true || underFinished === true
                const isCollapsed = (runningMode === true)
                  ? runCollapsedFor(n)
                  : ((collapsed[n.id] !== undefined) ? collapsed[n.id] : defaultCollapsed)
                const dotClass = (n.recentDone === true || (runningMode === true && recentShort(n) === true)) ? 'recent' : n.status
                const nameText = firstText(n.label, n.title, shortId(n.id))
                const hiddenName = (n.title !== undefined && n.label !== undefined && n.title !== n.label)
                  ? n.title
                  : undefined
                const modeText = n.mode === 'continuable' ? ' — continuable' : (n.mode === 'one-shot' ? ' — one-shot' : '')
                const rowTitle = (nameText + (dotClass === 'recent' ? ' — finished' : '')
                  + modeText
                  + (hiddenName !== undefined ? ' — ' + hiddenName : '') + ' — ' + n.id)
                const chip = isDiag ? n.reason : undefined
                const tail = tailFor(n)
                rows.push(React.createElement('div', {
                  key: n.id,
                  className: 'sgp-row' + (isCurrent ? ' sgp-current' : ''),
                  style: { paddingLeft: 6 + level * 18 },
                  title: rowTitle,
                  onClick: function () { selectNode(n) },
                },
                  React.createElement('span', {
                    className: 'sgp-chev' + (hasKids ? '' : ' sgp-chev-empty'),
                    onClick: function (e) {
                      e.stopPropagation()
                      if (runningMode === true) return
                      if (hasKids) toggleNode(n.id, defaultCollapsed)
                    },
                  }, hasKids ? (isCollapsed ? '\u25B8' : '\u25BE') : '\u2022'),
                  React.createElement('span', {
                    className: 'sgp-dot sgp-sdot-' + dotClass + (n.status === 'working' ? ' sgp-anim-working' : ''),
                    title: (n.recentDone === true || (runningMode === true && recentShort(n) === true)) ? 'finished' : n.status,
                  }),
                  React.createElement('span', {
                    className: 'sgp-name' + (isDiag ? ' sgp-diag' : ''),
                  }, nameText),
                  chip ? React.createElement('span', {
                    className: 'sgp-chip',
                    title: 'unreadable session entry',
                  }, chip) : null,
                  tail[0],
                  tail[1],
                ))
                if (rows.length >= MAX_ROWS) return
                if (hasKids && !isCollapsed) {
                  walk(n.id, level + 1, runningMode === true ? false : (hiddenFinished === true || underFinished === true))
                }
              }
            }
            walk(snap.root.id, 1, false)
          }

          let bodyChildren
          if (anchor === undefined) {
            bodyChildren = React.createElement('div', { className: 'sgp-note' },
              'No session is open yet. Open a session to watch its subagent tree.')
          } else if (snap === undefined) {
            bodyChildren = React.createElement('div', { className: 'sgp-note', key: 'sgp-loading' }, 'Reading the subagent tree…')
          } else {
            const rootOcc = pressureMap.get(snap.root.id)
            const rootTotal = subCounts.get(snap.root.id) || 0
            const rootDirect = (byParent.get(snap.root.id) || []).length
            const rootSame = rootDirect === rootTotal
            const rootRow = React.createElement('div', {
              key: snap.root.id,
              className: 'sgp-row sgp-rootrow' + (snap.root.id === current ? ' sgp-current' : ''),
              style: { paddingLeft: 6, paddingRight: 4 },
              onClick: function () { selectAnchor() },
              title: rootDetail,
            },
              React.createElement('span', { className: 'sgp-chev sgp-chev-empty' }, '\u25CB'),
              React.createElement('span', {
                className: 'sgp-dot sgp-sdot-' + snap.root.status + (snap.root.status === 'working' ? ' sgp-anim-working' : ''),
                title: snap.root.status,
              }),
              React.createElement('span', { className: 'sgp-name' },
                rootName || shortId(snap.root.id)),
              rootTotal > 0 ? React.createElement('span', {
                className: 'sgp-subcount',
                title: rootSame === true
                  ? (rootTotal + ' session' + (rootTotal === 1 ? '' : 's') + ' under this session — all direct')
                  : (rootDirect + ' direct / ' + rootTotal + ' total under this session'),
              }, rootSame === true ? String(rootTotal) : (rootDirect + '/' + rootTotal)) : null,
              rootOcc !== undefined ? React.createElement(CtxRing, { occ: rootOcc, below: true }) : React.createElement('span', { className: 'sgp-ringslot', 'aria-hidden': true }),
            )
            const pieces = [rootRow]
            for (const r of rows) pieces.push(r)
            if (rows.length >= MAX_ROWS) {
              pieces.push(React.createElement('div', { className: 'sgp-note', key: 'sgp-more' },
                'Showing the first ' + MAX_ROWS + ' entries.'))
            } else if (rows.length === 0) {
              pieces.push(React.createElement('div', { className: 'sgp-note', key: 'sgp-empty' },
                'No running subagents.'))
            }
            bodyChildren = pieces
          }

          return React.createElement('div', { className: 'sgp-tab', ref: rootRef },
            React.createElement('div', { className: 'sgp-body' }, bodyChildren),
            React.createElement('div', { className: 'sgp-footerline' },
              React.createElement('button', {
                type: 'button',
                className: 'sgp-runbtn' + (runningMode ? ' sgp-runbtn-on' : ''),
                title: runningMode
                  ? 'Running mode is on: only running subagents are shown, sections auto-expand while work runs and collapse when it finishes, finishers linger 10s, and Finished filters are hidden. Click to turn off.'
                  : 'Running mode: keep the tree compressed around running sessions — sections expand when work starts, collapse when it finishes, and Finished filters stay out of view. Click to enable.',
                onClick: function () { setRunningMode(function (v) { return !v }) },
              },
                React.createElement('span', { className: 'sgp-runbtn-dot' }),
                'Running',
              ),
              error !== undefined ? React.createElement('span', { className: 'sgp-errmsg', title: error }, error) : null,
            ),
          )
        }

        // One tab type in the right sidebar, plus its body keyed by the type
        // id (the sidebar renders bodies through the keyed
        // `sidebar.right.pane.tab` seat, so no host edit is involved).
        const tabTypes = ctx.get('sidebarRightTabs')
        if (tabTypes !== undefined) {
          ctx.effect(function () {
            return tabTypes.register({
              id: TAB_ID,
              kind: TAB_KIND,
              title: function () { return 'Subagents' },
            })
          }, 'subagent-tree: tab type')
        }

        slots.inject('sidebar.right.pane.tab', function () {
          return slots.register(
            { name: 'sidebar.right.pane.tab', key: TAB_ID },
            function (props) { return React.createElement(Entry, props) },
          )
        })

        slots.inject('conversation.session.header.utilities', function () {
          return slots.register(
            { name: 'conversation.session.header.utilities', id: 'sgtree-header', order: -1, label: 'Subagents' },
            function (props) {
              const sessionId = props !== undefined && props !== null && typeof props.sessionId === 'string'
                ? props.sessionId
                : undefined
              return React.createElement('button', {
                type: 'button',
                className: 'sgp-headerbtn',
                onClick: function () { toggleTree(sessionId) },
                title: 'Show or hide subagents in the sidebar',
              },
                React.createElement('span', null, 'Subagents'))
            },
          )
        })

        console.log('[sgtree] client half ready')
      },

      // Test seam (see test/token-format.test.js): the client factory cannot
      // import Node modules, so the pure formatter rides on the plugin object
      // where a test can reach it. Not part of the plugin contract.
      __formatTokens: formatTokens,
    }
  }
})
