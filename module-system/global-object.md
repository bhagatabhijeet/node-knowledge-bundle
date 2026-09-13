---
type: Overview
title: The global object
description: The globals JavaScript and Node.js provide, and why a variable declared in a file isn't one of them.
tags: [nodejs, module-system, globals]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: global-object-video
    resource: "training video (not retained in the bundle)"
    title: "The global object (walkthrough)"
---

# JavaScript's own globals

A few functions are part of the JavaScript language itself and available
wherever JavaScript runs — in a browser or in Node.js:

- `console.log(...)` and the rest of the `console` object.
- `setTimeout(fn, delay)` / `clearTimeout(id)` — call a function once,
  after a delay, or cancel that call.
- `setInterval(fn, delay)` / `clearInterval(id)` — call a function
  repeatedly on a delay, or stop it. See [timers](/api/timers.md) for the
  full set, including Node-specific additions like `setImmediate`.

# Browser: `window`

In a browser, all of these live on a single global object called
`window`. Anything declared globally — a function, a variable — is
attached to it too:

```js
var message = 'hi';
console.log(window.message); // 'hi'
console.log(message);        // same thing; window. is implicit
```

The JavaScript engine resolves a bare `console.log(...)` by implicitly
prefixing it with `window.`, since that's where the object actually lives.

# Node.js: `global`

Node.js has no `window` — there's no page for it to represent (see
[What is Node.js?](/getting-started/what-is-node.md)). In its place,
Node.js provides an equivalent object called `global`, which is where
`console`, `setTimeout`, and the rest actually live. Normally there's no
need to write the prefix — `console.log(...)` works exactly the same as
`global.console.log(...)`.

# The difference that matters: file-scoped, not global

Here's where Node.js diverges from a browser in a way that matters. In a
browser, a variable declared at the top level of a `<script>` becomes a
property of `window`. In Node.js, a variable declared at the top level of
a file is **not** added to `global`:

```js
var message = '';
console.log(global.message); // undefined
```
*Full source: [global-scope-demo.js](/assets/code/module-system/global-scope-demo.js)*

![VS Code showing var message = ''; console.log(global.message); as the only two lines in app.js](/assets/images/global-object-message-undefined.png)

Running this prints `undefined`, not `''`. The variable exists, but only
within the file that declared it — it never touches the shared `global`
object at all.

# Why: every file is its own module

This isn't a quirk — it's Node's module system. Every `.js` file Node.js
runs is treated as a separate module with its own private scope, so a
top-level `var`, `function`, or `class` in one file is invisible from
every other file unless it's explicitly exported. A browser's `<script>`
tags, by contrast, all share one global `window`, which is exactly the
kind of naming collision and hidden coupling module scoping avoids. See
[Modules](/runtime/modules.md) for how CommonJS and ESM implement that
per-file scope, and how a module opts something into being shared via
`module.exports` / `export`.

# Related

* [Modules](/runtime/modules.md) — how per-file scoping actually works,
  and how to share things across files on purpose.
* [timers](/api/timers.md) — the full `setTimeout`/`setInterval` family
  introduced here.
* [What is Node.js?](/getting-started/what-is-node.md) — why Node has no
  `window` in the first place.
