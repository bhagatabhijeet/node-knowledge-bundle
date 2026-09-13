---
type: Overview
title: Modules
description: Why Node wraps every file in its own module instead of sharing one global scope, and what the module object logged from inside a file actually contains.
tags: [nodejs, module-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: modules-video
    resource: "training video (not retained in the bundle)"
    title: "Modules (walkthrough)"
---

# The problem plain global scope creates

In browser-style JavaScript, declaring a variable or function at the top
level attaches it to the shared `window` object (see
[The global object](global-object.md)). That's manageable for a single
script, but real applications are split across many files. If two of
those files each declare a function with the same name — say, both
define `sayHello` — whichever one loads second silently overwrites the
first on that shared global object. Nothing warns you; the earlier
definition is just gone.

# Node's answer: every file is its own module

![Three module cards, each with its own private slot, representing separate .js files that don't share scope](/assets/images/module-scope-diagram.svg)

Node.js sidesteps this by never sharing one global scope across files in
the first place. Every `.js` file it runs is wrapped in its own
**module** — a private container for whatever variables and functions
that file declares. Two files can each declare `sayHello` without either
one touching the other, because neither declaration ever leaves its own
module. Borrowing an object-oriented term, everything declared at the
top of a file is private to its module by default; it's only visible
elsewhere if the file explicitly exports it.

This isn't a separate mechanism bolted on top of the language — it's the
actual reason `global` stays uncluttered. [The global object](global-object.md)
showed a top-level `var` failing to show up as a property of `global`;
per-file module scoping is why.

An application still needs one entry point, which Node calls the
**main module** — for the project this bundle has been building up, that's
`app.js` (see [Building your first Node.js program](/getting-started/building-first-node-program.md)).

# Looking at the module object itself

Every file also has direct access to an object literally called
`module`, describing the file the way Node sees it. Logging it shows
what's actually inside:

```js
console.log(module);
```
*Full source: [module-object-demo.js](/assets/code/module-system/module-object-demo.js)*

![VS Code showing console.log(module); as the only line in app.js](/assets/images/module-console-log-demo.png)

Running that with `node app.js` prints a `Module` object with several
of its own properties:

- **`id`** — a unique identifier for the module (`'.'` for the main module).
- **`exports`** — starts out as an empty object (`{}`); this is the piece
  a file hands to the outside world, covered in depth in
  [Modules](/runtime/modules.md).
- **`parent`** — the module that required this one in (`null` for the
  main module, since nothing required it).
- **`filename`** — the absolute path to the file backing this module.
- **`loaded`** — a boolean tracking whether the module has finished loading.
- **`children`** and **`paths`** — the modules this one has required, and
  the directories Node searches when resolving a bare `require()`
  specifier.

![Terminal running node app.js and printing the Module object with id, exports, parent, filename, loaded, children, and paths properties](/assets/images/module-object-terminal-output.png)

Worth calling out: `module` is not actually a property of `global`,
unlike `console` or `setTimeout` (see [The global object](global-object.md)).
It only *looks* global because it's available unprefixed in every file —
in reality each file gets its own separate `module` object, scoped to
that file. Trying `global.module` would come back `undefined`, for the
same reason `global.message` did there.

# What's next: sharing things on purpose

Encapsulation is only useful once there's a deliberate way to opt out of
it, and that empty `exports` object sitting on `module` is exactly that
escape hatch: a file assigns to `module.exports` to make something
public, and another file pulls it in with `require()`. That mechanic —
including the `exports` shorthand, and loading Node's own built-in
modules like `os` or `events` the same way — is covered in depth in
[Modules](/runtime/modules.md).

# Related

* [The global object](global-object.md) — the previous doc in this topic;
  `global` contrasted with the per-file scope described here.
* [Modules](/runtime/modules.md) — the `require()`/`module.exports`
  mechanics this doc sets up.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — the `app.js` file used as the main module throughout this bundle.
