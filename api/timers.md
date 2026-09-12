---
type: API Reference
title: "timers: scheduling work"
description: "Scheduling work: setTimeout, setInterval, setImmediate, process.nextTick."
resource: https://nodejs.org/api/timers.html
tags: [nodejs, api, timers]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# The four scheduling primitives

| Function                  | Runs                                                              |
|----------------------------|--------------------------------------------------------------------|
| `process.nextTick(fn)`     | Before the event loop continues to anything else — a microtask, not a phase. |
| `Promise.resolve().then()` | Same microtask queue as `nextTick`, drained after it (see [event loop](/runtime/event-loop.md)). |
| `setTimeout(fn, ms)`       | After at least `ms` milliseconds, during the `timers` phase.       |
| `setImmediate(fn)`         | During the `check` phase — after I/O callbacks in the current iteration, before the next `timers` phase. |
| `setInterval(fn, ms)`      | Repeatedly, every `ms` milliseconds, until cleared.                 |

`setTimeout(fn, 0)` does not mean "run immediately" — it still waits for
the `timers` phase and for `ms` to have elapsed (clamped to a minimum by
the runtime), and other callbacks scheduled ahead of it in that phase run
first.

# Clearing timers

```js
const id = setTimeout(fn, 1000);
clearTimeout(id);

const intervalId = setInterval(fn, 1000);
clearInterval(intervalId);
```

An uncleared `setInterval` keeps the process alive indefinitely, since
Node.js won't exit while a timer is still pending — a common cause of a
script that "hangs" instead of exiting after its visible work is done.

# Keeping the process alive (or not)

```js
const timer = setInterval(fn, 1000);
timer.unref(); // don't let this timer alone keep the process alive
timer.ref();   // undo unref()
```

`unref()` is useful for background/heartbeat timers that should never
block a clean process exit on their own.

# `setImmediate` vs. `setTimeout(fn, 0)`

Inside an I/O callback, `setImmediate` always fires before a
zero-delay `setTimeout`, because the `check` phase (immediates) comes
right after `poll` (I/O), while `timers` only comes around on the next
loop iteration. Outside of an I/O callback (e.g. at the top level of a
script), the relative order between the two is not guaranteed. Use
`setImmediate` when you specifically want "after I/O, this iteration."

# Related

* [Event loop](/runtime/event-loop.md) — the phases these timers run
  within.
* [Process](/runtime/process.md) — process exit depends on outstanding
  timers.
