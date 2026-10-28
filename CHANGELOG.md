# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] — 2026-10-27

### Changed

- **The poll slows down when nothing is running, and wakes instantly when
  something starts.** The fixed 2 s interval became a self-scheduling timeout:
  2 s while any session is running or the tree still shows `working`, 2 minutes
  otherwise. The poller also subscribes to the `sessions.list` snapshot store
  (fed by the host's status and activity frames), so a session starting,
  resuming or receiving a message reloads the tree immediately instead of
  waiting out the idle tick.
- The idle tick is deliberately not zero: the 2-minute idle drain
  (`IDLE_STALE_MS`) and the 10-minute finished grace (`RECENT_MS`) are computed
  host-side per request, so stopping outright would leave finished rows frozen
  in their old state until activity resumed. One request every 2 minutes —
  ~30/hour against 1,800 before — keeps both transitions resolving, and is a
  whole multiple of the shorter one. If either host constant changes, the
  idle interval must move with it.
- Activity is read level-triggered from the live snapshot on every decision —
  nothing is accumulated from change edges — so a session finishing at the same
  moment another starts cannot strand the poller.

## [1.0.5] — 2026-10-27

### Changed

- **The 2 s poller does no work while the tree cannot be seen.** It returns
  before the fetch when the page is hidden (minimised or backgrounded) or when
  the tree root fails `checkVisibility({ visibilityProperty: true })` — which
  covers the collapsed column and hidden panes. Collapsing the sidebar used to
  keep a 1,800-request/hour poll running off-frame; it now costs nothing. The
  timer itself keeps ticking as a cheap no-op, so revealing the column or
  restoring the window resumes on the next tick, with no subscription and no
  teardown. The element check (rather than `sidebarRight.isExpanded()`) is
  deliberate: a tab in a floating pane is visible while `expanded` is false.

## [1.0.4] — 2026-10-27

### Fixed

- **The tree's collapse state no longer resets when swapping sessions.** The
  dock remounts the tab body for each session, so every `useState` inside it
  started empty — collapsed sections, `Finished` filters and Running mode were
  lost on every switch. That state now lives in a per-session store outside the
  component (`uiStates`, keyed by the watched session id) and the component
  reads through it, so each session keeps its own view. A side effect is that
  the state also survives closing and reopening the tab; it is a plain
  in-memory store, so it resets when the page reloads.
- Removed the `[anchor]` effect that reset collapsed/Finished state. It existed
  for the old model where an anchor change meant a new tree, and it would have
  clobbered the restored state on mount.

### Changed

- The snapshot cache now lives beside that store instead of inside the
  component, so switching back to a session paints its last snapshot
  immediately rather than flashing the empty state before the poll returns.

## [1.0.3] — 2026-10-27

### Changed

- **The tree is a right-sidebar tab instead of a floating window.** It docks
  beside Files, Browser, Terminal and the subagent chat through the sidebar's
  tab-type registry (`sidebarRightTabs` plus the keyed
  `sidebar.right.pane.tab` seat), so the dock owns sizing, splitting, layout
  persistence and closing. The drag and resize machinery, the geometry state,
  the panel's own ✕ and the `shell.overlay` registration are gone; the browser
  half now injects `sidebarRight` and `sidebarRightTabs`.
- The session-header capsule reads **Subagents** (was "Subagent tree"), sizes
  to its text — the 111 px floor that matched the Session log capsule only left
  dead space once the label shortened — and now toggles: with no tab it opens
  one and reveals the column; with a tab showing it collapses the column and
  keeps the tab. Closing the tab is the tab's own ✕.
- Removed the panel's title bar: the dock tab is the only chrome above the
  tree. The `Subagents` tab title carries the label.
- Removed the refresh button and the "2s refresh" caption; the 2 s poll is the
  only refresh path.
- Removed the sidebar footer "Subagents…" button. The header capsule is the
  only opener, next to where the panel actually appears.

## [1.0.2] — 2026-10-27

### Changed

- **The panel now sits on the app's raised surface instead of the overlay
  surface.** `bg-overlay` is the lightest surface in the dark theme (`#61666b`
  against a `#151517` app base), which made the panel the brightest thing on
  screen. The body is `bg-layer-1` (`#232324`); the title bar and root row are
  a 5 % mix of the label color over it, so they lighten on dark and darken on
  light; hovers moved to `interactive-bg-hover` so they stay visible in both
  themes; the count badge is a 9 % chip. Measured dark-theme contrast improved
  across the board — secondary text 3.85 → 10.42, tertiary 2.72 → 7.36, the
  green working count 2.55 → 6.89, error text 1.76 → 4.77.
- The context tooltip is **opaque**. It used the app's `--dsw-specific-menu`
  token, which is 94 % alpha, so panel content showed through it. It is now a
  raised mix surface with a real border and shadow, and its plain text moved
  from `tertiary` to `secondary`.
- Status ink is brighter: `inactive` is a 1.5 px hollow `label-secondary` ring
  at full opacity (was 1 px at 70 %), finished/recent dots are
  `label-secondary` (was `label-tertiary`), and the working dot's pulse trough
  is 0.6 opacity instead of 0.35, which had been blending the green into the
  panel.
- The chevron-slot placeholder (`•` on leaves, `○` on the root) is
  `label-tertiary`. It was painted with `border-l1`, a 6 % alpha border token,
  which made the markers effectively invisible.
- The "N working" count is mixed 40 % toward the label color, so it reads at
  7.95:1 in dark (was 5.95) and 4.67:1 in light (was 2.05).

### Fixed

- Context figures switch to millions: `1048576` now renders `1m` instead of
  `1049k`, and `1500000` renders `1.5m`. A trailing `.0` is dropped at both the
  thousand and million steps, so the decimal appears only when the fraction is
  non-zero, and 999.5k rolls into `1m` rather than printing `1000k`.

### Added

- `npm test` (`node --test`) with the first test suite: `test/token-format.test.js`
  covers the formatter's unit boundaries and loads `client.js` through a stubbed
  `window.__ModuleLoader__`, so it exercises the shipped bundle. The pure
  formatter is exposed on the plugin object as `__formatTokens` for that purpose
  (a test seam, not plugin contract).

## [1.0.1] — 2026-10-27

### Fixed

- **The browser half did not work on DSH desktop 0.2.1-rc.3.** The client API
  moved under it; five call sites were ported and the plugin now declares
  `uiWorkspace` in its client `inject` list:
  - the current session is read from the Workspace selection store
    (`uiWorkspace.selection`), because `SessionListState` no longer carries a
    `current` field and a root-scoped overlay receives no `sessionId` prop;
  - context occupancy reads `projectionsBySession[id].values.contextPressure`
    instead of the removed `projectionValues`;
  - row clicks navigate with `uiWorkspace.openSession(...)` instead of the
    removed `sessions.open` / `sessions.openSubagent`;
  - the post-failure refresh calls `sessions.refreshProjections(id)` instead of
    the removed `sessions.refreshSubagents`.
- The idle grace is also stamped on first observation when no `agent/status`
  stamp exists, and idle stamps for disposed agents are pruned each poll.

### Changed

- Install instructions rewritten for the desktop app: the profile is `desktop`
  (not `web`), there is no `dsh` on `PATH`, and the app's own launcher at
  `resources/runtime/cli/bin/dsh.cmd` is the entry point. Verification no
  longer relies on `--dump-config`, which the desktop profile refuses.

## [1.0.0] — 2026-09-09

### Added

- Persistent subagent tree panel for the DSH web GUI: nested tree of
  delegated subagent sessions that survives page reloads, with click-to-open
  per row.
- Live status dots (working / idle / inactive / recent) with the 10-minute
  finished grace period and the 2-minute drain for terminated-or-interrupted
  continuable children (no end event exists for those; they drain once their
  idle state goes stale).
- `direct/total` badges on every collapsible section, collapsing to a single
  number when the counts are equal.
- Context-occupancy rings mirroring the model selector's context meter, with
  an "N% of context used — ~used / window" tooltip; an always-present meter
  line at the panel's right edge with reserved 18 px ring slots.
- Per-section `Finished [X]` filter rows; single-number finished count;
  revealed subtrees render collapsed.
- Running mode: auto-expand while work runs, auto-collapse when it finishes,
  10 s finisher linger, Finished filters hidden, diagnostics and chevrons
  inert while enabled.
- Draggable, resizable floating panel with a sidebar footer button opener.
- Host snapshot route `GET /sgtree/snapshot` (lossless JSON, title cache,
  first-seen end stamps).
- Bundle-form delivery: package carries `dsh.bundle.patch` (lib/patch.yml),
  so `dsh plugin --profile web add` installs and self-wires the composition.

### Changed

- The "Subagent tree" opener moved from a floating top-right pill (which
  clipped the header/content border) into the session header utilities
  cluster, rendered immediately to the left of the "Session log" button and
  styled like that capsule. The sidebar footer button is unchanged.
- The empty-state string is now one concise line — `No running subagents.` —
  in both plain and Running mode (the long onboarding sentence is gone).

### Fixed

- The browser half never reached the page while the host half was live: the
  client-module system resolves the client bundle via the package manifest,
  and the `exports` map did not expose `./package.json`, which Node's exports
  gating rejects. The scanner recorded this as a silent "not a client
  package" verdict, so `__DSH_BOOT__` carried no graph row — the plugin stayed
  visible in settings while the page UI showed nothing. The exports map now
  exposes the manifest path, exactly like the shipped client-UI packages this
  one was modeled on.
