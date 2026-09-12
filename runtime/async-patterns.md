---
type: Runtime Concept
title: Async patterns
description: Callbacks, promises, and async/await, and how to choose between them.
tags: [nodejs, runtime, async, promises, callbacks]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Three layers, one loop

All three patterns below ultimately schedule work on the same
[event loop](event-loop.md); they differ in how completion and errors are
surfaced to calling code, not in the underlying concurrency model.

# Error-first callbacks

Node.js's original convention: the last argument is a callback whose first
parameter is an error (or `null`).

```js
fs.readFile('/etc/hosts', 'utf8', (err, data) => {
  if (err) return handleError(err);
  console.log(data);
});
```

Still used by callback-only APIs and internally by streams, but no longer
the recommended style for new code because errors must be checked manually
at every step and nesting callbacks becomes hard to follow ("callback
hell").

# Promises

A `Promise` represents a value that will resolve or reject in the future.
`util.promisify` converts a conforming error-first function into one that
returns a promise; most built-in modules also ship a `*/promises` variant
directly (e.g. `fs/promises`, `dns/promises`).

```js
const { readFile } = require('node:fs/promises');

readFile('/etc/hosts', 'utf8')
  .then((data) => console.log(data))
  .catch(handleError);
```

`Promise.all` (fails fast on first rejection), `Promise.allSettled` (waits
for every promise, never rejects), and `Promise.race` combine multiple
promises for concurrent work.

# async/await

Syntactic sugar over promises that lets asynchronous code read like
synchronous code, with errors surfaced through ordinary `try`/`catch`:

```js
async function readHosts() {
  try {
    const data = await readFile('/etc/hosts', 'utf8');
    return data;
  } catch (err) {
    handleError(err);
  }
}
```

An `await` only pauses the enclosing `async function`; it does not block
the event loop, and other callbacks/microtasks run while the awaited
promise is pending.

# Choosing

- Prefer async/await for new code; it composes best with `try`/`catch` and
  keeps control flow readable.
- Reach for `Promise.all`/`allSettled` when awaiting one thing at a time
  would serialize independent work unnecessarily.
- Wrap legacy callback APIs with `util.promisify` rather than mixing
  styles in the same function.
- An unhandled promise rejection terminates the process by default (see
  [error handling](error-handling.md)); always attach a `.catch` or
  `try`/`catch` on every promise chain that can reject.

# Related

* [Error handling](error-handling.md) covers `unhandledRejection` and
  `uncaughtException`.
* [Streams](streams.md) predate promises and still expose an
  event-emitter-based, not promise-based, primary interface (though
  `stream/promises` exists for `pipeline` and `finished`).
