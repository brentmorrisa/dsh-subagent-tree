# Changelog

All notable changes to this project are documented in this file. The format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
