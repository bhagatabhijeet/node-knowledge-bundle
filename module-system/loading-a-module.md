---
type: Overview
title: Loading a module
description: Pulling logger.js into app.js with require(), calling its exported log() function, and why const beats var for the variable that holds the result.
tags: [nodejs, module-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: loading-a-module-video
    resource: "training video (not retained in the bundle)"
    title: "Loading a module (walkthrough)"
---

# Bringing `logger.js` into `app.js`

[Creating a module](creating-a-module.md) left off with a finished
`logger.js` — a private `url`, a `log()` function, and a single exported
member — sitting unused. A module only does something once another file
pulls it in, and the tool for that is `require()`: a function, available
unprefixed in every file, that Node itself provides — browsers have
nothing like it. `require()` takes one argument, the name or path of the
module you want, and hands back whatever that module put on
`module.exports`.

Because `logger.js` lives in the same folder as `app.js`, the path is
relative, and the leading `./` is not optional decoration — it's what
tells Node "look right here" rather than "search `node_modules`." The
`.js` extension can be dropped; Node assumes it. A file one level down
would be `./utils/logger`, and one level up would be `../logger` — same
idea, different starting point. This project's `logger` happens to be
local, but the exact same function loads Node's own built-in modules,
like `os`, by their bare name instead of a path — the full resolution
rules for telling the two apart are covered in
[Modules](/runtime/modules.md).

> **Note:** `require()` is Node's original (CommonJS) way to load a
> module. ES2015 (ES6) later standardized `import`/`export` as
> JavaScript's own module syntax, which Node also supports —
> `require()` wasn't replaced or deprecated by it, the two just
> coexist. See [Modules](/runtime/modules.md) for how they compare and
> interoperate.

Assigning the result to a variable and logging it shows exactly what
comes back:

```js
var logger = require('./logger');

console.log(logger);
```
*Full source: [require-logger.js](/assets/code/module-system/require-logger.js)*

Running `node app.js` prints `{ log: [Function: log] }` — not the whole
`logger.js` file, just the object that file assigned to
`module.exports`. That's the entire contract of `require()`: it doesn't
hand over the module's private variables or its source, only whatever
was deliberately exported.

# Calling the exported function

`require()`'s return value behaves like any other object, so the
exported `log` is reached the same way any method is:

```js
var logger = require('./logger');

logger.log('message');
```
*Full source: [require-and-call.js](/assets/code/module-system/require-and-call.js)*

![VS Code showing app.js with var logger = require('./logger'); on one line and logger.log('message'); below it](/assets/images/loading-module-require-call.png)

`node app.js` now prints `message` to the console — the string travels
from `app.js`, through `logger.log()`, out to `console.log()` inside
`logger.js`. Worth noticing along the way: VS Code offers `.log` in
autocomplete the moment `logger.` is typed, because it can see the
shape of the object `require()` returned — a small but genuine sign
that `logger` is a real, inspectable value, not a magic keyword.

# Why `const` beats `var` here

`var logger = require(...)` works, but it leaves `logger` reassignable,
and that opens the door to a mistake that's easy to make and confusing
to debug. Setting `logger = 1` by accident compiles and runs without
complaint — the failure only shows up later, at `logger.log('message')`,
as `TypeError: logger.log is not a function`. The line that's actually
broken and the line that reports the error are nowhere near each other.

Declaring the same variable with `const` turns that into an immediate,
obvious failure: attempting `logger = 1` throws
`TypeError: Assignment to constant variable` right where the mistake
happens, before the program gets anywhere near calling `.log()`. Static
analysis tools such as JSHint go a step further and flag the reassignment
while you're still typing, without running the code at all. Since a
module reference like this is never meant to be reassigned after
`require()` sets it, there's no downside to `const` and a real upside in
catching a typo close to its source:

```js
const logger = require('./logger');

logger.log('message');
```
*Full source: [require-const.js](/assets/code/module-system/require-const.js)*

![Terminal showing node app.js printed across several runs: the logged exports object, the printed message, and a TypeError from calling logger.log after logger was overwritten](/assets/images/loading-module-terminal-output.png)

# Exporting a single function instead of an object

`logger.js` currently exports an object with one property, `log`,
because that's the shape `module.exports` starts out as. But an object
is only useful when there's more than one thing to hand out — a second
method or a piece of configuration alongside it. With exactly one public
member, the whole object can be skipped by reassigning `module.exports`
directly to the function itself:

```js
var url = 'http://mylogger.io/log';

function log(message) {
  // Send an HTTP request
  console.log(message);
}

module.exports = log;
```
*Full source: [logger-single-export.js](/assets/code/module-system/logger-single-export.js)*

![VS Code showing logger.js with module.exports = log; replacing module.exports.log = log;](/assets/images/loading-module-export-single-function.png)

`require('./logger')` now returns the function itself rather than a
wrapper object, so the caller invokes it directly instead of reaching
through a `.log` property. Renaming the local variable from `logger` to
`log` at this point isn't required, but it matches what's actually being
required in — a function, not a logger-shaped object:

```js
const log = require('./logger');

log('message');
```
*Full source: [app-single-export-call.js](/assets/code/module-system/app-single-export-call.js)*

Both styles are legitimate `module.exports` patterns — an object of
named members, or a single function — and the choice comes down to how
many things a module actually needs to expose.

# Remember

**Remember:** `require('./logger')` only ever hands back what
`logger.js` put on `module.exports` — never its private variables, and
never its source. And once you have that value, declare it with `const`,
not `var`: an accidental reassignment then fails loudly, right at the
mistake, instead of surfacing as a confusing `TypeError` several lines
later.

# Related

* [Creating a module](creating-a-module.md) — the previous doc in this
  topic; builds the `logger.js` file that this doc requires into `app.js`.
* [Modules](modules.md) — why `module.exports` starts out as `{}` and
  what the rest of the `module` object contains.
* [Modules](/runtime/modules.md) — `require()`'s full path-resolution
  rules, including the `./` vs. bare-specifier distinction and loading
  Node's own built-in modules.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — the `app.js` this doc loads `logger.js` into.
