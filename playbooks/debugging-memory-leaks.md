---
type: Playbook
title: Debugging memory leaks
description: Finding and fixing unbounded memory growth in a running process.
tags: [nodejs, playbook, memory, debugging]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Trigger

Resident memory (RSS) climbs steadily under steady-state load instead of
plateauing, eventually triggering an out-of-memory restart or hitting the
`--max-old-space-size` heap limit.

# Common sources

- **Growing caches** with no eviction policy or size cap (a plain `Map`
  or object used as a cache).
- **Listener leaks**: subscribing a short-lived object to a long-lived
  [`EventEmitter`](/api/events.md) and never unsubscribing — see
  events.md's max-listeners warning as an early signal.
- **Closures over large objects** kept alive by a long-lived timer or
  callback (e.g. a `setInterval` closing over a large buffer that is never
  needed again).
- **Unbounded queues**: pushing work faster than it's consumed, with no
  [backpressure](/runtime/streams.md).

# Steps

1. **Confirm it's a leak, not normal variance.** Watch RSS across several
   full GC cycles under steady load; a healthy process's memory
   saw-tooths and returns to baseline; a leak's baseline keeps rising.

2. **Take heap snapshots.** Start the process with the inspector:

   ```sh
   node --inspect app.js
   ```

   Open `chrome://inspect` in Chrome, connect, and take two heap
   snapshots several minutes apart under load. The "Comparison" view
   between them highlights object types whose count grew without a
   matching drop — the most direct signal of what's being retained.

3. **Trace retainers.** For an object type that keeps growing, expand its
   retainer tree in the snapshot to find what's holding a reference —
   typically a cache, a listener array, or a closure.

4. **Reproduce minimally.** Isolate the suspected code path in a small
   script, force GC (`node --expose-gc`, then call `global.gc()|`),
   and confirm memory returns to baseline after the operation completes
   when the fix is applied.

5. **Fix and verify** with an eviction policy (LRU cap, TTL), an explicit
   `removeListener`/`off` on teardown, or clearing timers
   ([`clearInterval`](/api/timers.md)) that are no longer needed.

# Related

* [Events](/api/events.md) — listener leak mechanics.
* [Profiling performance](profiling-performance.md) — the CPU-side
  counterpart of this playbook.
