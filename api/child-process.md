---
type: API Reference
title: "child_process: spawning other processes"
description: Spawning and communicating with other processes.
resource: https://nodejs.org/api/child_process.html
tags: [nodejs, api, child-process, ipc]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Four ways to start a process

| Function  | Shell involved | Output               | Use for                                  |
|-----------|----------------|------------------------|-------------------------------------------|
| `spawn`   | No (by default)| [Streamed](/runtime/streams.md) | Long-running processes, large or unbounded output. |
| `exec`    | Yes            | Buffered (callback)   | Short commands; output fits comfortably in memory. |
| `execFile`| No             | Buffered (callback)   | Like `exec`, but runs a file directly — no shell injection risk. |
| `fork`    | No             | N/A (IPC channel)      | Spawning another Node.js script with a built-in message channel. |

```js
const { spawn } = require('node:child_process');

const child = spawn('grep', ['error', 'app.log']);
child.stdout.on('data', (chunk) => process.stdout.write(chunk));
child.on('close', (code) => console.log(`exited with ${code}`));
```

# Shell injection risk

`exec` runs its command string through a shell, so interpolating
unsanitized input builds an injectable command:

```js
// DANGEROUS if `filename` comes from user input:
exec(`cat ${filename}`);
```

`spawn`/`execFile` take the command and arguments as separate values and
do not invoke a shell by default, so arguments are passed literally rather
than parsed for shell metacharacters. Prefer them whenever the command or
its arguments include untrusted input.

# IPC with `fork`

```js
// parent.js
const { fork } = require('node:child_process');
const child = fork('./worker.js');
child.send({ task: 'process', payload: [1, 2, 3] });
child.on('message', (result) => console.log(result));

// worker.js
process.on('message', (msg) => {
  process.send({ result: msg.payload.length });
});
```

`fork` is specific to launching other Node.js processes; it wires up a
message-passing channel (`.send()`/`'message'`) on top of `spawn`. For
CPU-bound work within the same process instead of a separate one, see the
`worker_threads` module (lighter-weight, shared-memory-capable, but not
covered in this bundle).

# Related

* [Process](/runtime/process.md) — signals sent between parent and child.
* [Streams](/runtime/streams.md) — `stdout`/`stderr`/`stdin` on a spawned
  child are streams.
