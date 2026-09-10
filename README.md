# dsh-subagent-tree

A **Subagent tree panel** for the DeepSeek Harness (DSH) web GUI — a floating,
persistent window that shows every subagent session you delegated under a
conversation, arranged as a live tree.

It is a dual-half Cordis plugin package: a host half (`index.js`) that watches
the subagent registry and serves a snapshot route, and a browser half
(`client.js`) that renders the panel. One composition row mounts both.

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
- **Drag / resize** — the panel is movable and resizable; the layout is
  remembered by the browser, not the harness.
- Panel chrome and a sidebar footer button both open it; the primary opener
  is a "Subagent tree" capsule in the session header, immediately to the
  left of the "Session log" button.

## Requirements

- DeepSeek Harness with a **web profile** (the browser GUI).
- The plugin consumes the harness's own `subagents`, `webServer`, `sessions`,
  and `slots` services — no other setup.

## Install

`dsh plugin` installs the package into the web profile (pnpm-managed, so it
survives profile reinstalls) and — because the package declares its own bundle
patch (`dsh.bundle.patch`) — automatically joins its composition row into the
profile's bundle layer list. Nothing else to edit.

**From GitHub (one command):**

```sh
dsh plugin --profile web add github:<owner>/dsh-subagent-tree
```

**From a local clone or path:**

```sh
dsh plugin --profile web add C:\path\to\dsh-subagent-tree
```

Either way: **restart the DSH process**, then **refresh the browser page**.

**Manual fallback** (no pnpm, no plugin command):

Copy `package.json`, `index.js`, and `client.js` into
`%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-subagent-tree\`, then add
one row to `%USERPROFILE%\.dsh\profiles\web\cordis.patch.yml`:

```yaml
- insert:
  - name: dsh-subagent-tree
```

Then restart + refresh as above. Do not combine this manual row with the
bundle form on one profile: double insertion double-mounts the panel and
throws `webserver: duplicate exact route "/sgtree/snapshot"` at boot.

## Verification

```sh
node <dsh>/lib/bin.js web --dump-config
```

must list `- name: dsh-subagent-tree` exactly once and print no patch
warnings. In the browser devtools console, a successful boot logs
`[sgtree] client half ready`; the host side logs
`[sgtree] host half ready: /sgtree/snapshot route registered`.

## Diagnostics

- `web boot: N entries did not activate` naming this package — check that the
  browser tree provides `sessions` and `slots`, or read the import error on
  this package's console entry.
- Panel shows `snapshot request failed: HTTP 404` — the host half did not
  activate (`subagents` or `webServer` missing in the host tree).
- Pill missing entirely — the client bundle did not register; look for the
  import error and the `client half ready` marker.

## Screenshot

<img width="616" height="723" alt="image" src="https://github.com/user-attachments/assets/d05bf77c-3077-4b3d-9d6a-61ed168a75a0" />

## Development

See [`AGENTS.md`](AGENTS.md) — file map, static-runtime constraints, the edit
and validate flow, and the behavior contract the panel is expected to keep.

## License

[MIT](LICENSE)
