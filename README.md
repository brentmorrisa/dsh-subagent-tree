# dsh-subagent-tree

A **Subagent tree panel** for the DeepSeek Harness (DSH) web GUI — a tab in the
right sidebar that shows every subagent session you delegated under a
conversation, arranged as a live tree.

It is a dual-half Cordis plugin package: a host half (`index.js`) that watches
the subagent registry and serves a snapshot route, and a browser half
(`client.js`) that renders the tab. One composition row mounts both.

## Features

- **Persistent tree** — subagent sessions stay in the panel across page
  reloads, nested to any depth (subagents of subagents).
- **Live status dots** — working (pulsing), idle, inactive, and grey
  "recently finished" grace period; click any row to open that session.
- **Direct/total badges** — every collapsible section shows how many sessions
  sit directly under it and how many in total it contains (`3/31`), collapsing
  to a single number when the counts are equal.
- **Context-occupancy rings** — a per-session ring mirroring the model
  selector's context meter, with an "N% of context used" tooltip that includes
  token figures.
- **Finished sections** — sessions that finish tuck behind a `Finished [X]`
  filter row at the top of their section (10 minutes after completion), so the
  roster stays readable without losing history.
- **Running mode** — an optional compressed view: sections auto-expand while
  work runs, collapse when it finishes, finishers linger 10 s, the Finished
  filters stay out of view, and everything that isn't running is hidden.
- **Docked, not floating** — the tree is a right-sidebar tab docked beside
  Files, Browser, Terminal and the subagent chat. The dock owns sizing,
  splitting and layout persistence per session; there is nothing to drag.
- A **"Subagents" capsule in the session header** (immediately left of the
  "Session log" button) toggles it: with no tab it opens one and reveals the
  column; with the column showing it collapses the column and leaves the tab
  in place. Closing the tab is the tab's own ✕.

### How a row's status is derived

The host half never trusts the browser for liveness; it asks the harness on
every poll and returns one of four states:

- **working** — the live agent registry reports the session `running`.
- **idle** — the agent is resident and `idle`, for up to two minutes. The
  timestamp comes from the `agent/status` event, whose dispatcher fuses the
  agent into the payload, so the id is always available. If an agent is
  already idle when the panel mounts (or a build ever omits that identity),
  the first observation is stamped instead, so the grace still elapses rather
  than being skipped.
- **inactive** — no live agent, or an idle agent whose two-minute grace has
  expired.
- **recently finished** — a grey dot for ten minutes after `subagent/end`
  stamps the session, before it tucks into that section's `Finished` row.

A stamp is never refreshed, so a drained agent stays inactive until it runs
again, and stamps for disposed agents are dropped each poll.

## Requirements

- DeepSeek Harness with the browser GUI. Verified against the **DSH desktop app
  0.2.1-rc.3**, whose profile is named `desktop`.
- The plugin consumes the harness's own services — no other setup:
  - host half: `subagents`, `webServer`
  - browser half: `sessions`, `slots`, `uiWorkspace`, `sidebarRight`,
    `sidebarRightTabs`
- **The `web` profile no longer exists in the desktop app.** Older DSH
  releases ran as a Node service with a free-named profile (`dsh web`); the
  desktop app reserves the single `desktop` profile and manages it itself.

## Install

The desktop app ships DSH as an Electron bundle, so there is **no `dsh` on
`PATH`** — use the launcher inside the installation. On Windows:

**From a local clone or path** (what this checkout is installed as, and the
form verified on 0.2.1-rc.3):

```bat
"%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add C:\path\to\dsh-subagent-tree
```

A path install records a `link:` dependency, so the checkout itself becomes the
installed copy: edit it, restart, and the change is live.

**From GitHub:**

```bat
"%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add github:brentmorrisa/dsh-subagent-tree
```

A `github:` install materializes a snapshot copy in the profile rather than
linking, so it installs whatever version `main` carries. **It needs 1.0.1 or
later** — 1.0.0 predates the client-API port recorded in
[`CHANGELOG.md`](CHANGELOG.md), and its panel will not render on the desktop
app. If `main` is still at 1.0.0, use the path form (or push the fixes first),
and re-install after any future fix since the copy does not track the
repository.

Either form is a single command because the package declares its own bundle
patch (`dsh.bundle.patch` → `lib/patch.yml`): `dsh plugin` installs the package
into `%USERPROFILE%\.dsh\profiles\desktop` (pnpm-managed, so it survives
profile reinstalls) **and** reconciles its composition row into the profile's
`dsh.profile.bundles`. Nothing else to edit.

Then **fully quit and reopen the app**, and **refresh the page**. The host half
usually hot-applies as soon as the bundle row lands; the browser bundle is
picked up on the next page load. A change to `index.js` needs the app restart.

Notes for the desktop profile:

- `dsh --profile desktop` (boot, `--dump-config`, …) is refused by design —
  the desktop profile is reserved for the app. Only the `plugin` subcommand is
  allowed, and only through the app's own launcher, which passes the desktop
  flag that permits it.
- Do not also add the `insert` row to `cordis.patch.yml` — a manual row plus
  the bundle form double-mounts the panel and throws
  `webserver: duplicate exact route "/sgtree/snapshot"` at boot.

**Manual fallback** (only if the app launcher cannot be used):

Copy `package.json`, `index.js`, `client.js`, and `lib/patch.yml` into
`%USERPROFILE%\.dsh\profiles\desktop\node_modules\dsh-subagent-tree\`, then add
one row to `%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml`:

```yaml
- insert:
  - name: dsh-subagent-tree
```

## Verification

The profile's composed tree cannot be dumped on the desktop app
(`--dump-config` is refused), so verify against the running app instead:

- **Route** — the host half serves `GET /sgtree/snapshot?rootId=<sessionId>` on
  the GUI origin (the port the app opened, e.g. `http://127.0.0.1:60446`). On
  0.2.1-rc.3 a plain request answers without extra credentials, unlike the
  app's own pages: a live host returns JSON with `revision`, `root`, and
  `nodes`, and an unknown id answers
  `{"revision":N,"error":"session \"…\" not found"}`. A 404 means the host half
  did not activate.
- **Browser console** — a successful boot logs `[sgtree] client half ready`,
  and the host logs
  `[sgtree] host half ready: /sgtree/snapshot route registered`.
- **UI** — a "Subagents" capsule appears in the session header immediately
  left of the "Session log" button. Clicking it opens the tab and reveals the
  column; clicking it again while the column is showing collapses the column
  and leaves the tab in the strip.

## Diagnostics

- `web boot: N entries did not activate` naming this package — the host tree is
  missing `subagents` or `webServer`, or the browser tree is missing
  `sessions`/`slots`/`uiWorkspace`; read the import error on this package's
  console entry.
- Panel shows `snapshot request failed: HTTP 404` — the host half did not
  activate (`subagents` or `webServer` missing in the host tree).
- Capsule missing entirely — the client bundle did not register. Check the
  console for an import error, and that the manifest still declares
  `dsh.client.platform: "web"` and exports **both** `./client` and
  `./package.json` (that second export is required for discovery and its
  absence fails silently).
- `duplicate exact route "/sgtree/snapshot"` — both the bundle row and a manual
  `cordis.patch.yml` row are present; remove one.

## Screenshot

<img width="616" height="723" alt="image" src="https://github.com/user-attachments/assets/d05bf77c-3077-4b3d-9d6a-61ed168a75a0" />

## Development

See [`AGENTS.md`](AGENTS.md) — file map, static-runtime constraints, the edit
and validate flow, and the behavior contract the panel is expected to keep.

## License

[MIT](LICENSE)
