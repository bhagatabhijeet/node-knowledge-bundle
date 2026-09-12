---
type: Playbook
title: Profiling performance
description: Finding CPU hotspots with the built-in profiler and flamegraphs.
tags: [nodejs, playbook, performance, profiling]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Trigger

A process is spending more CPU time, or more wall-clock latency, than
expected, and it's unclear which function is responsible. This is the
CPU-side counterpart to [debugging memory leaks](debugging-memory-leaks.md);
run this playbook when memory is stable but throughput or latency is not.

# Steps

1. **Capture a CPU profile** using the built-in V8 profiler:

   ```sh
   node --cpu-prof --cpu-prof-dir=./profiles app.js
   ```

   For a running process instead of a fresh start, attach with the
   inspector (`node --inspect`) and record a CPU profile from
   `chrome://inspect`'s Performance panel, or send `SIGUSR1` /
   use `node --prof` (legacy tick-based profiler; `--cpu-prof` is
   generally preferred for its structured `.cpuprofile` output).

2. **Load the profile.** A `.cpuprofile` file opens directly in Chrome
   DevTools' Performance panel ("Load profile"), rendering it as a
   flamegraph: width represents time spent, and stacking represents call
   depth.

3. **Read the flamegraph bottom-up first.** The widest frames at the
   bottom of a stack are where time is actually spent (as opposed to
   merely being on the call path); sort by "Self Time" to find the
   functions worth optimizing, not just the ones that appear most often
   in traces.

4. **Watch for these common patterns:**
   - A synchronous function blocking the [event loop](/runtime/event-loop.md)
     (visible as one very wide, unbroken frame with no I/O gaps beneath
     it).
   - Excessive small allocations causing frequent garbage collection
     (visible as recurring `(garbage collector)` frames).
   - `JSON.parse`/`JSON.stringify` on large payloads on the hot path.
   - Synchronous [fs](/api/fs.md) calls (`readFileSync`, etc.) in a
     request handler.

5. **Fix, then re-profile** under the same load to confirm the hot frame
   shrank rather than assuming from the code change alone.

# Third-party tools

`clinic.js` (`clinic doctor`, `clinic flame`) and `0x` wrap the same
underlying V8 profiler with friendlier flamegraph rendering and
automatic diagnosis of common patterns (event-loop blocking, I/O-bound
vs. CPU-bound), useful when the raw DevTools flamegraph is hard to read.

# Related

* [Event loop](/runtime/event-loop.md) — what "blocking the loop" means
  mechanically.
* [Debugging memory leaks](debugging-memory-leaks.md) — the memory-side
  counterpart.
