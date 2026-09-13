---
type: Overview
title: Loading a module
description: Pulling modules into a file with require() and import(), calling exported functions, understanding CommonJS vs ES6 modules, and why const beats var for the variable that holds the result.
tags: [nodejs, module-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: loading-a-module-video
    resource: "training video (not retained in the bundle)"
    title: "Loading a module (walkthrough)"
---

# Two ways to load a module

Node.js supports two ways to load and use modules:

1. **ES6 Modules (ESM)** — `import` / `export` (**recommended for new projects**)
2. **CommonJS** — `require()` / `module.exports` (still fully supported)

This doc explains both, starting with CommonJS concepts, then showing the modern ES6 approach.

# Loading with CommonJS: `require()`

[Creating a module](creating-a-module.md) left off with a finished
`logger.js` — a private `url`, a `log()` function, and a single exported
member — sitting unused. A module only does something once another file
pulls it in, and in CommonJS, the tool for that is `require()`: a function, available
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

## Calling the exported function with `require()`

`require()`'s return value behaves like any other object, so the
exported `log` is reached the same way any method is:

```js
const logger = require('./logger');

logger.log('message');
```
*Full source: [require-and-call.js](/assets/code/module-system/require-and-call.js)*

![VS Code showing app.js with const logger = require('./logger'); on one line and logger.log('message'); below it](/assets/images/loading-module-require-call.png)

`node app.js` now prints `message` to the console — the string travels
from `app.js`, through `logger.log()`, out to `console.log()` inside
`logger.js`. Worth noticing along the way: VS Code offers `.log` in
autocomplete the moment `logger.` is typed, because it can see the
shape of the object `require()` returned — a small but genuine sign
that `logger` is a real, inspectable value, not a magic keyword.

## Why `const` beats `var` for module imports

### The problem with `var`

`var logger = require(...)` works, but it leaves `logger` reassignable,
and that opens the door to a mistake that's easy to make and confusing
to debug:

```js
var logger = require('./logger');

logger.log('message');      // works fine
logger = 1;                 // accidental reassignment — no error!
logger.log('another');      // TypeError: logger.log is not a function
```

The issue: Setting `logger = 1` by accident compiles and runs without
complaint — the failure only shows up later, at `logger.log('another')`,
as `TypeError: logger.log is not a function`. The line that's actually
broken and the line that reports the error are nowhere near each other,
making bugs like this extremely frustrating to debug.

### The solution: use `const`

Declaring the same variable with `const` turns that into an immediate,
obvious failure:

```js
const logger = require('./logger');

logger.log('message');      // works fine
logger = 1;                 // TypeError: Assignment to constant variable
```

Attempting `logger = 1` throws `TypeError: Assignment to constant variable`
right where the mistake happens, before the program gets anywhere near calling
`.log()`. The error surfaces at the actual problem, not downstream.

### Static analysis tools catch it before runtime

Static analysis tools such as **JSHint** and **ESLint** go even further — they
flag the reassignment while you're still typing, without running the code
at all:

```js
const logger = require('./logger');

logger = 1;  // JSHint/ESLint shows: "Invalid assignment target"
```

![VS Code showing JSHint error highlighting when attempting to reassign a const variable](/assets/images/const-reassignment-jshint-error.png)

The error appears in your editor in real time, often with a red squiggle under
the offending line. Many modern editors integrate JSHint or ESLint by default,
so you catch typos before they become runtime bugs.

### Best practice: always use `const` for imports

Since a module reference like this is never meant to be reassigned after
`require()` or `import` sets it, there's no downside to `const` and a real
upside in catching mistakes close to their source:

```js
const logger = require('./logger');

logger.log('message');
```
*Full source: [require-const.js](/assets/code/module-system/require-const.js)*

## Exporting a single function instead of an object

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

# Loading with ES6 Modules: `import` (Recommended for new projects)

**For new projects, use ES6 modules instead of CommonJS.** ES6 modules are the official JavaScript standard and provide better tooling, static analysis, and browser compatibility.

To use ES6 modules, ensure your `package.json` has `"type": "module"`:

```json
{ "name": "my-app", "type": "module" }
```

## Importing and calling with ES6

With ESM, the same logger pattern is cleaner and more modern:

```js
// logger.js (with "type": "module" in package.json)
export function log(message) {
  console.log(message);
}
```

Importing it into another file:

```js
// app.js
import { log } from './logger.js';

log('message');
```

**Key differences from CommonJS:**
- Use `import` instead of `require()`
- Use `export` instead of `module.exports`
- File extensions are required in specifiers (`./logger.js`, not `./logger`)
- Imports are at the top level and are static — they're analyzed before the code runs
- Better IDE support and tree-shaking (removing unused code)

## Using `const` with ES6 imports

The same principle applies to ES6 imports — always use `const`:

```js
import { log } from './logger.js';

log('message');      // works fine
log = () => {};      // TypeError: Assignment to constant variable
```

Named imports (`import { log }`) and default imports (`import log from ...`) are
both constant bindings by default. Attempting to reassign them fails at the
exact point of the mistake, and tools like ESLint catch the error before
you even run the code:

```js
import { log } from './logger.js';

log = null;  // ESLint shows: "Assignment to constant variable"
```

![VS Code showing ESLint error for reassigning an imported binding](/assets/images/esm-import-reassignment-eslint-error.png)

## Default exports vs named exports

CommonJS exports a single value on `module.exports`. ESM has two patterns:

**Named exports** — export multiple values:
```js
// logger.js
export function log(message) { console.log(message); }
export function error(message) { console.error(message); }
```

```js
// app.js
import { log, error } from './logger.js';
log('info');
error('oops');
```

**Default export** — export a single primary value:
```js
// logger.js
export default function log(message) {
  console.log(message);
}
```

```js
// app.js
import log from './logger.js';
log('message');
```

# CommonJS vs ES6: When to use each

| Aspect | ES6 Modules | CommonJS |
|--------|-------------|----------|
| **Recommended for** | ✅ New projects | Legacy projects |
| **Official status** | Official JavaScript standard | Original Node.js format |
| **Syntax** | `import`/`export` | `require()`/`module.exports` |
| **Static analysis** | ✅ Better (analyzed before run) | Weaker (evaluated at runtime) |
| **Tooling support** | ✅ Excellent | Good |
| **Browser compatible** | ✅ Yes (same syntax) | No |
| **Learning curve** | Easy | Easy |

# Remember

**Remember:** 
- **Always use `const` when importing or requiring a module.** This ensures that accidental reassignments fail immediately at the mistake, not downstream where they're confusing to debug.
- **Static analysis tools like JSHint and ESLint catch const reassignments in real time,** flagging errors in your editor before you run the code. This is why `const` is superior to `var` for module bindings.
- **For new projects, use ES6 modules** (`import`/`export`). Set `"type": "module"` in `package.json` and Node will treat `.js` files as ESM.
- When using ES6, always include file extensions in import paths: `./logger.js`, not `./logger`.
- Both CommonJS and ESM are fully supported, and Node.js can load one from the other in most cases. See [Modules](/runtime/modules.md) for interoperability details.

# Related

* [Creating a module](creating-a-module.md) — the previous doc in this
  topic; builds the `logger.js` file that this doc requires into `app.js`.
* [Modules](modules.md) — why `module.exports` starts out as `{}` and
  what the rest of the `module` object contains.
* [Modules](/runtime/modules.md) — CommonJS vs ESM in depth, path-resolution
  rules, the `./` vs. bare-specifier distinction, and interoperability.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — the `app.js` this doc loads `logger.js` into.
