---
type: API Reference
title: "events: EventEmitter"
description: The EventEmitter class underlying most Node.js APIs.
resource: https://nodejs.org/api/events.html
tags: [nodejs, api, events, eventemitter]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Definition

`EventEmitter` is the base pattern most of Node.js's own asynchronous APIs
are built on: [streams](/runtime/streams.md), [http](http.md) requests and
responses, and [process](/runtime/process.md) all extend it.

```js
const { EventEmitter } = require('node:events');

class Job extends EventEmitter {}

const job = new Job();
job.on('progress', (pct) => console.log(`${pct}%`));
job.once('done', () => console.log('finished')); // fires at most once
job.emit('progress', 50);
```
*Full source: [events-emitter-basic-usage.js](/assets/code/api/events-emitter-basic-usage.js)*

# The special `'error'` event

If an `EventEmitter` emits `'error'` and no listener is registered for it,
Node.js throws the error and, uncaught, crashes the process — unlike every
other event name, which silently does nothing when unlistened. Any
long-lived emitter (a stream, a socket, a custom emitter representing a
background job) must have an `'error'` listener before it can fail safely.

```js
stream.on('error', (err) => { /* required, or the process crashes */ });
```

# Removing listeners

```js
const handler = (data) => console.log(data);
emitter.on('data', handler);
emitter.off('data', handler); // or removeListener
emitter.removeAllListeners('data');
```
*Full source: [events-remove-listeners.js](/assets/code/api/events-remove-listeners.js)*

Forgetting to remove listeners on short-lived objects (e.g. a per-request
emitter subscribed to a long-lived singleton) is a common source of
[memory leaks](/playbooks/debugging-memory-leaks.md): each leaked listener
keeps its closure, and everything it references, alive.

# The max-listeners warning

By default, registering more than 10 listeners for the same event on one
emitter logs a `MaxListenersExceededWarning` — usually a sign of a
listener leak rather than a real need for more listeners.
`emitter.setMaxListeners(n)` raises the threshold when a higher count is
genuinely expected (e.g. a shared event bus with many subscribers).

# Remember

**Remember:** every event name is forgiving except `'error'` — emit it
with no listener attached and Node doesn't shrug, it throws and crashes
the process, so any long-lived emitter (a socket, a stream, a background
job) needs an `.on('error', ...)` handler wired up before it can ever
fail safely.

# Related

* [Streams](/runtime/streams.md) — the most common `EventEmitter` subclass
  in practice.
* [Debugging memory leaks](/playbooks/debugging-memory-leaks.md) — listener
  leaks as a leak source.
