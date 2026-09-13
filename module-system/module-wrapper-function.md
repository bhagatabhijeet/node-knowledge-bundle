---
type: Overview
title: Module wrapper function
description: The hidden function Node wraps around each CommonJS module and why it injects exports, require, module, __filename, and __dirname without creating global variables.
tags: [nodejs, module-system, commonjs]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: module-wrapper-video
    resource: "training video (not retained in the bundle)"
    title: "Module wrapper function (walkthrough)"
---

# The hidden wrapper around every CommonJS file

Node does not run a CommonJS file as a free-floating top-level script in
one giant shared scope. Internally, it wraps the file in a function that
looks roughly like this:

```js
(function (exports, require, module, __filename, __dirname) {
  // your file's code lives here
});
```

This is the **module wrapper function**. It is not something you normally
write by hand, but it is a good mental model for what Node is doing
behind the scenes when it loads a file.

# Why the wrapper matters

The wrapper solves the major problem introduced by per-file module
scoping:

- each file needs access to the tools that make modular code work;
- those tools should be available inside the file;
- they should not leak onto the real global object and pollute every file.

That is why `require`, `module`, and `exports` feel global while still
behaving as if they are local to one file. They are function parameters,
not properties of `global`.

The same idea applies to `__filename` and `__dirname`:

- `__filename` is the absolute path to the current file;
- `__dirname` is the absolute path to the current directory.

They are injected by the wrapper so code can locate itself without
reaching into a shared global state.

# A file sees these values without sharing them

This is the crucial distinction:

```js
console.log(require);
console.log(module);
console.log(exports);
console.log(__filename);
console.log(__dirname);
```

Those names are available in any CommonJS file because Node passes them in
as arguments to the wrapper function. The file can use them immediately,
but they are not globals in the browser sense, and they do not become
shared properties of `global`.

That is why the earlier docs in this topic could say:

- `global.message` was `undefined` when a top-level variable was declared
  in a file;
- `global.module` is also `undefined`;
- the file still has `module` available because Node provided it as a
  local parameter to the module wrapper.

# What this means for `exports` and `module.exports`

The wrapper gives every CommonJS file an `exports` object and a `module`
object. Those two are intentionally connected:

```js
console.log(exports === module.exports); // true
```

This is the mechanism that lets a file decide what it exposes to the
outside world. The module does not declare a variable in the global
namespace and hope other files find it; instead, it assigns to
`module.exports` or augments `exports` and Node hands that value to any
caller that does `require()`.

This is one reason the wrapper is so important: it creates a place where
file-local state can be shared deliberately, instead of letting every file
collide on one shared scope.

# A simplified mental model

You can think of Node doing something like this when it loads a file:

```js
function runModule(module, filename) {
  const exports = module.exports;
  const require = createRequire(filename);
  const __dirname = path.dirname(filename);
  const __filename = filename;

  // then it runs the file body here
}
```

It is not literally the exact implementation, but it matches the design:
Node provides the file with a local, private environment and a controlled
way to expose data outward.

# Why this is different from browser globals

In a browser, top-level variables and functions are attached to the shared
window, so collisions happen easily. In Node, CommonJS files are wrapped,
so the code inside one file can safely use names like `require` and
`module` without those names being ordinary shared globals.

This is why the module system can feel "global" at first glance and still
be private under the hood.

# Remember

**Remember:** the module wrapper function is the reason CommonJS files can
use `require`, `module`, `exports`, `__filename`, and `__dirname` without
those names becoming shared browser-style globals. Node injects them into
each file's private scope so modules can stay isolated while still sharing
specific values on purpose.

# Related

* [Modules](modules.md) — the per-file module scope and the `module`
  object this wrapper sets up.
* [Creating a module](creating-a-module.md) — where a file assigns its
  public API to `module.exports`.
* [Loading a module](loading-a-module.md) — how another file receives and
  calls that exported value via `require()`.
