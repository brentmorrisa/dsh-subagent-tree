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
`.sgp-headerbtn{display:inline-flex;align-items:center;gap:4px;border:1px solid var(--dsw-alias-border-l2);min-width:111px;height:32px;padding:6px 12px;border-radius:18px;background:transparent;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);font-size:13px;font-weight:400;line-height:20px;cursor:pointer}
.sgp-headerbtn:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sgp-headerbtn span{white-space:nowrap}
.sgp-root{position:fixed;z-index:61;pointer-events:auto;display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-overlay);box-shadow:0 14px 36px rgba(0,0,0,.22);overflow:hidden}
.sgp-titlebar{display:flex;align-items:center;gap:8px;padding:8px 10px;cursor:grab;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);user-select:none}
.sgp-titlebar.sgp-dragging{cursor:grabbing}
.sgp-titledot{width:8px;height:8px;border-radius:50%;flex:none}
.sgp-titletext{font-size:12.5px;font-weight:600;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;cursor:pointer}
.sgp-titletext:hover{color:var(--dsw-alias-brand-primary)}
.sgp-count{flex:none;font-size:11px;color:var(--dsw-alias-state-success-primary);white-space:nowrap}
.sgp-tbtn{flex:none;border:none;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:13px;padding:3px 6px;border-radius:6px}
.sgp-tbtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.sgp-body{flex:1;overflow:auto;padding:5px 4px 8px}
.sgp-row{display:flex;align-items:center;gap:6px;height:25px;border-radius:6px;cursor:pointer;padding-right:4px;color:var(--dsw-alias-label-primary)}
.sgp-row:hover{background:var(--dsw-alias-bg-layer-2)}
.sgp-rootrow{font-weight:600;margin-bottom:3px;background:var(--dsw-alias-bg-layer-1)}
.sgp-current{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:-1px}
.sgp-chev{width:18px;height:20px;flex:none;cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:11px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.sgp-chev:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.sgp-chev-empty{cursor:default;color:var(--dsw-alias-border-l1)}
.sgp-chev-empty:hover{background:transparent;color:var(--dsw-alias-border-l1)}
.sgp-dot{width:8px;height:8px;border-radius:50%;flex:none}
.sgp-sdot-working{background:var(--dsw-alias-state-success-primary)}
.sgp-sdot-idle{background:var(--dsw-alias-brand-primary);opacity:.65}
.sgp-sdot-inactive{background:transparent;box-shadow:inset 0 0 0 1px var(--dsw-alias-label-secondary);opacity:.7}
.sgp-sdot-recent{background:var(--dsw-alias-label-tertiary)}
.sgp-sdot-fin{background:var(--dsw-alias-label-tertiary)}
.sgp-sdot-corrupt,.sgp-sdot-unavailable{background:var(--dsw-alias-state-error-primary)}
.sgp-anim-working{animation:sgp-pulse 1.5s ease-in-out infinite}
@keyframes sgp-pulse{0%,100%{opacity:1}50%{opacity:.35}}
.sgp-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1;font-size:12.5px}
.sgp-diag{color:var(--dsw-alias-label-secondary);text-decoration:line-through}
.sgp-chip{flex:none;font-size:10px;padding:1px 6px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary)}
.sgp-ringwrap{position:relative;width:18px;height:18px;flex:none;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;cursor:default}
.sgp-ringwrap:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sgp-ringslot{flex:none;width:18px;height:1px}
.sgp-ring{display:block}
.sgp-ring-track{fill:none;stroke:var(--dsw-alias-border-l3);stroke-width:2px}
.sgp-ring-fill{fill:none;stroke:var(--dsw-alias-label-tertiary);stroke-width:2px;stroke-linecap:round}
.sgp-rtip{position:absolute;bottom:calc(100% + 6px);right:-3px;z-index:100;box-sizing:border-box;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-tertiary);cursor:default;border-radius:10px;padding:6px 10px;font-size:12px;line-height:18px;white-space:nowrap;pointer-events:none;display:flex;align-items:baseline}
.sgp-rtip-below{bottom:auto;top:calc(100% + 6px)}
.sgp-rtip-pct{color:var(--dsw-alias-label-primary);font-weight:500}
.sgp-rtip-rest{margin-left:3px}
.sgp-rtip-fig{margin-left:10px;padding-left:10px;border-left:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums;font-weight:500}
.sgp-subcount{flex:none;font-size:10.5px;min-width:16px;text-align:center;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border-radius:999px;padding:1px 6px}
.sgp-row:hover .sgp-subcount{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-overlay)}
.sgp-finrow{color:var(--dsw-alias-label-secondary);font-weight:600}
.sgp-note{padding:14px 16px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}
.sgp-footerline{display:flex;align-items:center;gap:6px;border-top:1px solid var(--dsw-alias-border-l1);padding:4px 10px;color:var(--dsw-alias-label-secondary);font-size:11px;white-space:nowrap;overflow:hidden}
.sgp-errmsg{color:var(--dsw-alias-state-error-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sgp-resize{position:absolute;right:0;bottom:0;width:14px;height:14px;cursor:nwse-resize;background:linear-gradient(135deg,transparent 50%,var(--dsw-alias-border-l2) 50%)}
.sgp-footbtn{display:flex;align-items:center;gap:6px;width:100%;text-align:left;padding:7px 14px;border:none;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12.5px;border-radius:8px}
.sgp-footbtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
.sgp-runbtn{display:inline-flex;align-items:center;gap:5px;flex:none;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:11px;padding:2px 8px;border-radius:999px;white-space:nowrap}
.sgp-runbtn:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}
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

    return {
      inject: ['sessions', 'slots', 'uiWorkspace'],
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

        const shared = { open: false, listeners: [] }
        const setOpen = function (value) {
          shared.open = value
          const list = shared.listeners.slice()
          for (const fn of list) fn()
        }
        const usePanelOpen = function () {
          const pair = React.useState(shared.open)
          React.useEffect(function () {
            const listener = function () { pair[1](shared.open) }
            shared.listeners.push(listener)
            return function () {
              const idx = shared.listeners.indexOf(listener)
              if (idx >= 0) shared.listeners.splice(idx, 1)
            }
          }, [])
          return pair[0]
        }

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
        const fmtTokens = function (v) {
          if (!isFinite(v)) return '?'
          if (v >= 1000) {
            const k = v / 1000
            return (k >= 100 ? String(Math.round(k)) : (Math.round(k * 10) / 10).toFixed(1)) + 'k'
          }
          return String(Math.round(v))
        }
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
              React.createElement('span', { className: 'sgp-rtip-fig' }, '~' + fmtTokens(occ.used) + ' / ' + fmtTokens(occ.window)),
            ) : null,
          )
        }

        const Entry = function (propsRaw) {
          const useSessionsProp = propsRaw && propsRaw.useSessions
          const open = usePanelOpen()
          // The current session comes from the Workspace selection store: the
          // session-list snapshot no longer carries a `current` field, and this
          // overlay is root-scoped so it receives no `sessionId` slot prop.
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
          const current = selection === undefined || selection === null ? undefined : selection.sessionId

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

          const colPair = React.useState({})
          const collapsed = colPair[0]
          const setCollapsed = colPair[1]

          const finPair = React.useState({})
          const showFin = finPair[0]
          const setShowFin = finPair[1]

          const focusPair = React.useState(0)
          const focusTick = focusPair[0]
          const bumpFocus = focusPair[1]

          const dragPair = React.useState(false)
          const dragging = dragPair[0]
          const setDragging = dragPair[1]

          const cacheBox = React.useState(function () { return new Map() })[0]
          const movingBox = React.useState(function () { return { active: false, pending: false, downX: 0, downY: 0, offTop: 0, startX: 0, startRight: 0 } })[0]
          const sizingBox = React.useState(function () { return { active: false, startX: 0, startY: 0, w: 0, h: 0 } })[0]
          const geoPairs = React.useState(function () { return { top: 72, right: 18, width: 400, height: 470 } })
          const geo = geoPairs[0]
          const setGeo = geoPairs[1]

          const runPair = React.useState(false)
          const runningMode = runPair[0]
          const setRunningMode = runPair[1]

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

          React.useEffect(function () {
            setCollapsed({})
            setShowFin({})
          }, [anchor])

          React.useEffect(function () {
            if (!open || anchor === undefined) return
            let cancelled = false
            let busy = false
            const load = function () {
              if (busy === true) return
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
          }, [open, anchor, focusTick])

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

          if (!open) {
            return null
          }

          const snap = snapPre
          const workingCount = snap
            ? snap.nodes.filter(function (n) { return n.status === 'working' }).length
            : 0

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

          const onBtnPointerDown = function (e) { e.stopPropagation() }
          const onBarPointerDown = function (e) {
            if (e.button !== undefined && e.button !== 0) return
            movingBox.active = true
            movingBox.pending = true
            movingBox.downX = e.clientX
            movingBox.downY = e.clientY
            movingBox.offTop = e.clientY - geo.top
            movingBox.startX = e.clientX
            movingBox.startRight = geo.right
          }
          const onBarPointerMove = function (e) {
            if (!movingBox.active) return
            if (movingBox.pending === true) {
              if (Math.abs(e.clientX - movingBox.downX) < 4 && Math.abs(e.clientY - movingBox.downY) < 4) return
              movingBox.pending = false
              try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
              setDragging(true)
            }
            setGeo({
              top: Math.max(0, Math.min(2200, e.clientY - movingBox.offTop)),
              right: Math.max(0, Math.min(2400, movingBox.startRight + (movingBox.startX - e.clientX))),
              width: geo.width,
              height: geo.height,
            })
          }
          const onBarPointerUp = function (e) {
            if (movingBox.active) {
              movingBox.active = false
              movingBox.pending = false
              setDragging(false)
              try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) {}
            }
          }
          const onResizeDown = function (e) {
            e.stopPropagation()
            sizingBox.active = true
            sizingBox.startX = e.clientX
            sizingBox.startY = e.clientY
            sizingBox.w = geo.width
            sizingBox.h = geo.height
            try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
          }
          const onResizeMove = function (e) {
            if (!sizingBox.active) return
            setGeo({
              top: geo.top,
              right: geo.right,
              width: Math.max(280, Math.min(1400, sizingBox.w + (e.clientX - sizingBox.startX))),
              height: Math.max(200, Math.min(2200, sizingBox.h + (e.clientY - sizingBox.startY))),
            })
          }
          const onResizeUp = function (e) {
            sizingBox.active = false
            try { e.currentTarget.releasePointerCapture(e.pointerId) } catch (err) {}
          }

          return React.createElement('div', {
            className: 'sgp-root',
            role: 'dialog',
            'aria-label': 'Subagent tree panel',
            style: {
              top: geo.top,
              right: geo.right,
              width: geo.width,
              height: geo.height,
              maxHeight: 'calc(100vh - 40px)',
            },
          },
            React.createElement('div', {
              className: 'sgp-titlebar' + (dragging ? ' sgp-dragging' : ''),
              onPointerDown: onBarPointerDown,
              onPointerMove: onBarPointerMove,
              onPointerUp: onBarPointerUp,
            },
              React.createElement('span', {
                className: 'sgp-titledot' + (snap !== undefined ? ' sgp-sdot-' + snap.root.status : ' sgp-sdot-inactive'),
                title: 'Watched session status',
              }),
              React.createElement('span', {
                className: 'sgp-titletext',
                onClick: function () { selectAnchor() },
                title: anchor !== undefined ? 'Watched session — ' + rootDetail : 'No session',
              }, 'Subagents'),
              workingCount > 0 ? React.createElement('span', { className: 'sgp-count' }, workingCount + ' working') : null,
              React.createElement('button', {
                type: 'button', className: 'sgp-tbtn', title: 'Refresh now',
                onPointerDown: onBtnPointerDown,
                onClick: function () { bumpFocus(function (t) { return t + 1 }) },
              }, '\u27F3'),
              React.createElement('button', {
                type: 'button', className: 'sgp-tbtn', title: 'Close',
                onPointerDown: onBtnPointerDown,
                onClick: function () { setOpen(false) },
              }, '\u2715'),
            ),
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
              React.createElement('span', {}, '2s refresh'),
              error !== undefined ? React.createElement('span', { className: 'sgp-errmsg', title: error }, error) : null,
            ),
            React.createElement('div', {
              className: 'sgp-resize',
              onPointerDown: onResizeDown,
              onPointerMove: onResizeMove,
              onPointerUp: onResizeUp,
            }),
          )
        }

        slots.inject('shell.overlay', function () {
          return slots.register(
            { name: 'shell.overlay', id: 'sgtree-panel', order: 30, label: 'Subagent tree panel' },
            function (props) { return React.createElement(Entry, props) },
          )
        })

        slots.inject('conversation.session.header.utilities', function () {
          return slots.register(
            { name: 'conversation.session.header.utilities', id: 'sgtree-header', order: -1, label: 'Subagent tree' },
            function () {
              return React.createElement('button', {
                type: 'button',
                className: 'sgp-headerbtn',
                onClick: function () { setOpen(true) },
                title: 'Open the subagent tree panel',
              },
                React.createElement('span', null, 'Subagent tree'))
            },
          )
        })

        slots.inject('sidebar.footer.action', function () {
          return slots.register(
            { name: 'sidebar.footer.action', id: 'sgtree-open', order: 10, label: 'Subagent tree' },
            function () {
              return React.createElement('button', {
                type: 'button',
                className: 'sgp-footbtn',
                onClick: function () { setOpen(true) },
              }, 'Subagent tree…')
            },
          )
        })

        console.log('[sgtree] client half ready')
      },
    }
  }
})
