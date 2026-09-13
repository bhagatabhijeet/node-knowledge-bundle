---
type: Overview
title: Creating a module
description: Walking through writing an actual module file — a private variable and function — and choosing what to expose from it with module.exports. Export patterns include objects with multiple members or a single function.
tags: [nodejs, module-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: creating-a-module-video
    resource: "training video (not retained in the bundle)"
    title: "Creating a module (walkthrough)"
---

# The scenario: a reusable logger

[Modules](modules.md) established that every `.js` file gets its own
private scope and showed the empty `exports` object sitting on `module`,
waiting to be filled in. This doc puts that to work by creating a real
module: a small logging helper that other files — in this project or a
future one — could reuse instead of duplicating logging code everywhere.

Imagine the logger eventually talks to a remote logging service: you send
it an HTTP request and it writes the message to the cloud on your behalf.
That means the module needs two things: the service's URL, and a function
that sends the message there. Both start out as ordinary top-level
declarations in a new file, `logger.js`:

```js
var url = 'http://mylogger.io/log';

function log(message) {
  // Send an HTTP request
  console.log(message);
}
```
*Full source: [logger-private.js](/assets/code/module-system/logger-private.js)*

![VS Code showing logger.js with a url variable and a log function that currently just console.logs the message](/assets/images/creating-module-logger-initial.png)

`log()` doesn't actually send a request yet — building that out would
pull focus onto HTTP details that have nothing to do with modules. For
now it just prints the message to the console, which is enough to prove
the module works once something else calls into it.

# Both of these are private by default

Nothing about `url` or `log` looks different from a normal variable and
function declaration, and that's the point: per [Modules](modules.md),
every top-level declaration in `logger.js` is scoped to that file. `app.js`
— the main module this bundle has been building up in
[Building your first Node.js program](/getting-started/building-first-node-program.md)
— has no way to reach either one yet, even though both files live in the
same project folder. Being in the same directory has no bearing on
visibility; only exporting does.

# Two export patterns

Node.js supports two common export patterns, and choosing between them depends on
how many things your module needs to expose.

## Pattern 1: Export an object with named members

[Modules](modules.md) showed that every file's `module` object starts
with an empty `exports: {}`. Making something public means adding a
property to that object — the property name becomes the name the caller
sees, and it doesn't have to match the name used internally. To expose
`log`, add a `log` property to `module.exports` and point it at the
function already defined above:

```js
var url = 'http://mylogger.io/log';

function log(message) {
  // Send an HTTP request
  console.log(message);
}

module.exports.log = log;
```
*Full source: [logger.js](/assets/code/module-system/logger.js)*

![VS Code showing logger.js with module.exports.log = log added as the last line](/assets/images/creating-module-logger-exports.png)

The same pattern works for `url`, and it doesn't have to keep its
internal name on the way out — `module.exports.endPoint = url;` would
expose it publicly as `endPoint` while the file still calls it `url`
internally. But `url` is purely an implementation detail here: it only
matters to `log()`, and no caller needs to see it or change it. A useful
mental model is a DVD player — the buttons on the front are its public
interface, deliberately small and stable, while the circuit board inside
is free to change between models because nothing outside depends on it
directly. A module's `exports` object is that front panel: keep it to
what callers actually need, and leave everything else — `url` included —
private. So `url` never gets a line added for it, and `logger.js` is left
with a single, minimal, public member: `log`.

### Using the object export in `app.js`

When you export an object with named members, the caller accesses them as properties:

```js
const logger = require('./logger');

logger.log('message');  // Call the log method on the exported object
```

This pattern is ideal when a module needs to export **multiple functions or values**.

## Pattern 2: Export a single function directly

Sometimes a module's sole purpose is to provide a single function. In those cases,
instead of wrapping the function in an object, you can replace `module.exports`
entirely with just the function:

```js
var url = 'http://mylogger.io/log';

function log(message) {
  // Send an HTTP request
  console.log(message);
}

module.exports = log;
```
*Full source: [logger-single-export.js](/assets/code/module-system/logger-single-export.js)*

![VS Code showing logger.js with module.exports = log; (replacing module.exports.log = log)](/assets/images/loading-module-export-single-function.png)

Instead of adding a property to `module.exports`, you're **reassigning the entire
exports object** to the function itself. Now `require('./logger')` returns the
function directly, not a wrapper object.

### Using the single function export in `app.js`

When you export a single function, the caller receives the function directly and
can invoke it without accessing a property:

```js
const log = require('./logger');

log('message');  // Call the function directly — no property access needed
```

Notice the difference: with the object pattern it's `logger.log()`, but with
the single function pattern it's just `log()`. The result is cleaner and more
direct.

## Comparing the two patterns

| Aspect | Object Export | Single Function Export |
|--------|---|---|
| **When to use** | Module exports 2+ functions or values | Module exports exactly 1 primary function |
| **Pattern** | `module.exports.log = log;` | `module.exports = log;` |
| **Caller usage** | `const logger = require('./logger');`<br>`logger.log('msg')` | `const log = require('./logger');`<br>`log('msg')` |
| **Example modules** | `fs`, `path`, `http` (provide many APIs) | lodash utilities, single processors |

Both styles are equally legitimate — the choice comes down to how many things
your module actually needs to expose. Use whichever pattern matches the module's
purpose.

# What's next: loading it from `app.js`

`logger.js` is a complete module at this point, but it isn't doing
anything on its own — a module only earns its keep once something
`require()`s it. That's the other half of the mechanic this doc set up
for: pulling `logger.js` into `app.js` by its relative path, the export
patterns covered here, and loading Node's own built-in modules like `os`
the same way, is covered in depth in [Modules](/runtime/modules.md) — see
[Loading a module](loading-a-module.md) for that require() step itself.

> **Note:** `require()` is Node's original (CommonJS) way to load a
> module. ES2015 (ES6) later standardized `import`/`export` as
> JavaScript's own module syntax, which Node also supports — `require()`
> wasn't replaced or deprecated by it, the two just coexist. See
> [Modules](/runtime/modules.md) for how they compare and interoperate.

# Remember

**Remember:** You have two main export patterns:
1. **Named members on an object**: `module.exports.log = log;` — Use when your module provides multiple functions or values. The caller accesses them as properties: `logger.log()`.
2. **Single function**: `module.exports = log;` — Use when your module's sole purpose is to provide one primary function. The caller invokes it directly: `log()`.

In both cases, you're drawing the line between a module's public face and its private
implementation. Keep your exports minimal — expose only what callers need, and leave
everything else (like the private `url` variable) sealed inside.

# Related

* [Modules](modules.md) — the previous doc in this topic; explains why
  `logger.js`'s declarations are private by default and what `module`
  looks like before anything is exported.
* [Loading a module](loading-a-module.md) — the next doc in this topic; shows how
  to `require()` the module you created here and call its exported functions.
* [Modules](/runtime/modules.md) — the `require()`/`module.exports`
  mechanics, including the `exports` shorthand and built-in modules,
  that pick up where this doc leaves off.
* [The global object](global-object.md) — contrasts this per-file privacy
  with how browser globals work.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — the `app.js` this logger module is meant to be loaded into.
