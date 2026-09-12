---
type: Runtime Concept
title: The event loop
description: How Node.js schedules timers, I/O callbacks, and microtasks on a single thread.
tags: [nodejs, runtime, concurrency, event-loop]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Definition

Node.js runs JavaScript on a single thread but delegates I/O, timers, and
some crypto/zlib work to [libuv](https://libuv.org), a C library that manages
a thread pool and the OS's async I/O primitives. The **event loop** is the
mechanism that repeatedly picks up completed work from libuv and runs the
corresponding JavaScript callback.

# Phases

Each iteration of the loop runs through a fixed set of phases, each holding
its own callback queue:

| Phase              | Executes                                                        |
|--------------------|------------------------------------------------------------------|
| `timers`           | Callbacks scheduled by [`setTimeout`/`setInterval`](/api/timers.md) whose threshold has elapsed. |
| `pending callbacks`| Some system-level callbacks deferred from the previous iteration (e.g. certain TCP errors). |
| `idle, prepare`    | Internal use only.                                               |
| `poll`             | Retrieves new I/O events; executes I/O-related callbacks (almost all except close, timers, `setImmediate`). Blocks here if nothing else is scheduled. |
| `check`            | Callbacks scheduled by [`setImmediate`](/api/timers.md).          |
| `close callbacks`  | e.g. `socket.on('close', ...)`.                                   |

# Microtasks

Between every callback (not just between phases), Node.js drains two
microtask queues, in order:

1. `process.nextTick` callbacks.
2. Promise reaction callbacks (`.then`/`.catch`/`.finally`, and the
   continuation after `await`).

This means `process.nextTick` and promise microtasks can starve the event
loop if they keep scheduling more of themselves, since the loop cannot
advance to the next phase until both queues are empty.

# Ordering example

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

console.log('sync');
```

Output: `sync`, `nextTick`, `promise`, then `timeout`/`immediate` in an order
that depends on the surrounding context (inside an I/O callback,
`immediate` always fires before `timeout`; at the top level, the order is
not guaranteed since both race against timer resolution).

# Blocking the loop

Because JavaScript execution is single-threaded, a long synchronous
computation (a tight loop, `JSON.parse` on a huge string, synchronous
crypto) blocks every other callback, timer, and incoming request until it
finishes. See [error handling](error-handling.md) and
[profiling performance](/playbooks/profiling-performance.md) for how to
find and avoid this in practice.

# Related

* [Async patterns](async-patterns.md) links the phases above to the
  callback/promise/async-await surface most code is written against.
* [Streams](streams.md) are built on top of poll-phase I/O events.
