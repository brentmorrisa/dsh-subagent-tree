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
- **Rooted at the top-level session** — open the tab from inside a subagent and
  it still shows the top-level session's tree, with the session you are in
  outlined. Clicking the root row goes back up. A parent that only becomes
  discoverable later (say, after a restart) re-roots the tree by itself.
- **The view follows you** — switching to a session that has the tab open in the
  one you left opens it there too. Collapsed sections, `Finished` filters and
  Running mode are shared across every tab showing the same tree, so expanding
  in a child and coming back to the parent keeps the same expansion.
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
- **Nested trees need delegation depth 2.** The harness caps delegation at
  `maxDepth` 1 by default, which permits direct children only — the panel
  will faithfully render whatever exists, but nothing two levels deep can be
  created until that is raised (Plugins → Subagent → Limits, or
  `- id: subagent` with `config: { maxDepth: 2 }` in the profile patch).
  It applies on the next delegation attempt, no restart.

## Install

The desktop app ships DSH as an Electron bundle, so there is **no `dsh` on
`PATH`** — use the launcher inside the installation: `resources/runtime/cli/bin/`
under the app's resources directory. The examples below show the Windows form
(`dsh.cmd`); other platforms ship an equivalent launcher at the same relative
path.

**From a local clone or path** (the form a development checkout uses):

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
linking, so it installs whatever version `main` carries. The client-API port
landed in 1.0.1, so anything older than that will not render on the desktop
app; the current `main` is 1.0.6. Because the copy does not track the
repository, re-install after any future fix.

Either form is a single command because the package declares its own bundle
patch (`dsh.bundle.patch` → `lib/patch.yml`): `dsh plugin` installs the package
into `<DSH_HOME>/profiles/desktop` (normally `~/.dsh`, pnpm-managed so it
survives profile reinstalls) **and** reconciles its composition row into the
profile's `dsh.profile.bundles`. Nothing else to edit.

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
`<DSH_HOME>/profiles/desktop/node_modules/dsh-subagent-tree/`, then add
one row to `<DSH_HOME>/profiles/desktop/cordis.patch.yml`:

```yaml
- insert:
  - name: dsh-subagent-tree
```

## Verification

The profile's composed tree cannot be dumped on the desktop app
(`--dump-config` is refused), so verify against the running app instead:

- **Route** — the host half serves `GET /sgtree/snapshot?rootId=<sessionId>` on
  the GUI origin (the port the app opened, e.g. `http://127.0.0.1:<port>`). On
  the version verified here a plain request answers without extra credentials,
  unlike the app's own pages: a live host returns JSON with `revision`, `root`,
  and `nodes`, and an unknown id answers
  `{"revision":N,"error":"session \"…\" not found"}`. A 404 means the host half
  did not activate.
- **Browser console** — a successful boot logs `[sgtree] client half ready`,
  and the host logs
  `[sgtree] host half ready: /sgtree/snapshot route registered`.
- **UI** — a "Subagents" capsule appears in the session header immediately
  left of the "Session log" button. Clicking it opens the tab and reveals the
  column; clicking it again while the column is showing collapses the column
  and leaves the tab in the strip.
- **Rooting** — open the tab from inside a subagent session: the root row should
  name the top-level session (not the subagent), and the subagent you are in
  should appear as an outlined row. Clicking the root row returns to it.

## Diagnostics

- `web boot: N entries did not activate` naming this package — the host tree is
  missing `subagents` or `webServer`, or the browser tree is missing
  `sessions`/`slots`/`uiWorkspace`/`sidebarRight`/`sidebarRightTabs`; read the
  import error on this package's console entry.
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

(Taken in the pre-1.0.3 floating-window layout. The tree now docks as a
right-sidebar tab, as described above.)

## Development

See [`AGENTS.md`](AGENTS.md) — file map, static-runtime constraints, the edit
and validate flow, and the behavior contract the panel is expected to keep.

## License

[MIT](LICENSE)
