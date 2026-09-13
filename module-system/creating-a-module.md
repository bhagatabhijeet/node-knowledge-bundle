---
type: Overview
title: Creating a module
description: Walking through writing an actual module file — a private variable and function — and choosing what to expose from it with module.exports.
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

# Opting in with `module.exports`

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

# What's next: loading it from `app.js`

`logger.js` is a complete module at this point, but it isn't doing
anything on its own — a module only earns its keep once something
`require()`s it. That's the other half of the mechanic this doc set up
for: pulling `logger.js` into `app.js` by its relative path, along with
the `exports` shorthand and loading Node's own built-in modules like `os`
the same way, is covered in depth in [Modules](/runtime/modules.md).

# Related

* [Modules](modules.md) — the previous doc in this topic; explains why
  `logger.js`'s declarations are private by default and what `module`
  looks like before anything is exported.
* [Modules](/runtime/modules.md) — the `require()`/`module.exports`
  mechanics, including the `exports` shorthand and built-in modules,
  that pick up where this doc leaves off.
* [The global object](global-object.md) — contrasts this per-file privacy
  with how browser globals work.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — the `app.js` this logger module is meant to be loaded into.
