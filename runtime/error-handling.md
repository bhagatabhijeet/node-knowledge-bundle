---
type: Runtime Concept
title: Error handling
description: Operational vs. programmer errors, and where to catch each kind.
tags: [nodejs, runtime, errors, reliability]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: joyent-errors
    resource: https://www.joyent.com/node-js/production/design/errors
    title: "Joyent: Error Handling in Node.js"
---

# Two kinds of error

A useful distinction for deciding *where* to handle an error:[^joyent-errors]

- **Operational errors**: runtime conditions a correct program must expect
  — a failed network request, a file that doesn't exist, invalid user
  input, a timeout. These should be handled where they occur (a
  `try`/`catch`, a rejected promise's `.catch`, an error-first callback's
  `err` argument).
- **Programmer errors**: bugs — calling a function with the wrong argument
  type, a `null` dereference, a broken invariant. These are not
  recoverable at the point they're thrown; the safest response is usually
  to let the process crash and restart under a supervisor, since
  continuing risks running with corrupted state.

[^joyent-errors]: Joyent: Error Handling in Node.js

# Synchronous errors

Standard `try`/`catch` around synchronous code, or around an `await`ed
promise (see [async patterns](async-patterns.md)):

```js
try {
  JSON.parse(input);
} catch (err) {
  // operational: input was invalid, handle locally
}
```
*Full source: [try-catch-json-parse.js](/assets/code/runtime/try-catch-json-parse.js)*

# Process-level safety nets

```js
process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1); // do not resume normal operation
});

process.on('unhandledRejection', (reason) => {
  logger.fatal(reason);
  process.exit(1);
});
```
*Full source: [process-level-error-handlers.js](/assets/code/runtime/process-level-error-handlers.js)*

Both events are last-resort nets, not a substitute for handling errors
where they occur. Node.js's own guidance treats a thrown
`uncaughtException` as an unclean state: the correct response is to log
and exit, letting a process supervisor restart cleanly, not to swallow the
error and keep serving requests. As of recent Node.js versions,
`unhandledRejection` defaults to terminating the process (in older
versions it only printed a warning), so an application should not rely on
implicit behavior here and should register an explicit handler.

# Custom error types

Subclassing `Error` preserves the stack trace and lets callers
discriminate error kinds programmatically instead of matching message
strings:

```js
class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.code = 'ERR_NOT_FOUND';
  }
}
```
*Full source: [custom-error-class.js](/assets/code/runtime/custom-error-class.js)*

# Related

* [Process](process.md) — the `process` object these handlers attach to.
* [Async patterns](async-patterns.md) — promise rejection propagation.
