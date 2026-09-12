---
type: Runtime Concept
title: The process object
description: The `process` global -- environment, arguments, exit codes, and signals.
tags: [nodejs, runtime, process, signals]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Definition

`process` is a global `EventEmitter` (see [events](/api/events.md))
providing information about, and control over, the current Node.js
process. It requires no `require()`/`import`.

# Inputs

```js
process.argv;    // ['node', '/path/to/script.js', 'arg1', 'arg2', ...]
process.env;     // shallow copy of the process's environment variables
process.cwd();   // current working directory
process.platform;// 'linux' | 'darwin' | 'win32' | ...
process.version; // Node.js version, e.g. 'v22.11.0'
```
*Full source: [process-inputs.js](/assets/code/runtime/process-inputs.js)*

`process.env` values are always strings; a missing variable reads as
`undefined`, never throws.

# Exiting

```js
process.exitCode = 1;  // preferred: lets pending I/O and 'exit' listeners run
process.exit(1);       // immediate: terminates now, may cut off pending async work
```
*Full source: [process-exit-vs-exitcode.js](/assets/code/runtime/process-exit-vs-exitcode.js)*

Setting `process.exitCode` and letting the event loop drain naturally is
safer than calling `process.exit()` directly, which can truncate
in-flight writes (e.g. an unflushed `console.log` to a pipe).

# Lifecycle events

```js
process.on('exit', (code) => { /* only synchronous work allowed here */ });
process.on('uncaughtException', (err) => { /* last-resort; see below */ });
process.on('unhandledRejection', (reason) => { /* promise rejected, no .catch */ });
```
*Full source: [process-lifecycle-events.js](/assets/code/runtime/process-lifecycle-events.js)*

`'exit'` fires synchronously right before the process terminates — no
further async work (timers, I/O) can be scheduled from it. See
[error handling](error-handling.md) for how `uncaughtException` and
`unhandledRejection` fit into a broader error strategy.

# Signals

```js
process.on('SIGTERM', () => {
  server.close(() => process.exit(0)); // graceful shutdown
});
```
*Full source: [process-sigterm-handler.js](/assets/code/runtime/process-sigterm-handler.js)*

Orchestrators (Kubernetes, systemd, process managers) send `SIGTERM` to
request graceful shutdown before escalating to `SIGKILL` (which cannot be
caught). A process that does not handle `SIGTERM` and close its own
listeners/connections risks being force-killed mid-request.

# Related

* [Error handling](error-handling.md) — `uncaughtException` and
  `unhandledRejection` handling strategy.
* [child_process](/api/child-process.md) — sending signals to and
  receiving them from other processes.
