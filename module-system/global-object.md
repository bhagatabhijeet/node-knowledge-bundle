---
type: Overview
title: The global object
description: Why console and the timer functions live on global but a variable you declare yourself does not.
tags: [nodejs, module-system, globals]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: global-object-video
    resource: "training video (not retained in the bundle)"
    title: "The global object (walkthrough)"
---

# Where these globals actually come from

A few functions show up unprefixed wherever JavaScript runs — in a
browser or in Node.js:

- `console.log(...)` and the rest of the `console` object.
- `setTimeout(fn, delay)` / `clearTimeout(id)` — call a function once,
  after a delay, or cancel that call.
- `setInterval(fn, delay)` / `clearInterval(id)` — call a function
  repeatedly on a delay, or stop it. See [timers](/api/timers.md) for the
  full set, including Node-specific additions like `setImmediate`.

It's tempting to assume these are part of the JavaScript language itself,
but they aren't. **V8** — the engine Node.js embeds (see
[Node.js architecture](/getting-started/node-architecture.md)) — only
implements the ECMAScript language: variables, functions, closures,
`Promise`, and so on. `console` and the timer functions above are not in
that spec. They exist because the **runtime environment** wrapped around
the engine adds them — a browser adds its own version, and Node.js adds
its own, separately implemented version. That's why both feel available
"for free," despite neither being part of JavaScript proper.

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
Node.js's runtime environment provides an equivalent object called
`global`, and it's the actual home of `console`, `setTimeout`,
`clearTimeout`, `setInterval`, and `clearInterval` — all four of them are
genuine properties of `global`, added by Node itself rather than by V8.
Normally there's no need to write the prefix — `console.log(...)` works
exactly the same as `global.console.log(...)`, and `setTimeout(fn, 1000)`
the same as `global.setTimeout(fn, 1000)`.

# The essential difference: file-scoped, not global

This is the point worth calling out explicitly, because it's easy to
assume `global` behaves exactly like `window` just because both hold
`console` and the timer functions: **it doesn't**, for anything *you*
declare. In a browser, a variable declared at the top level of a
`<script>` becomes a property of `window`, right alongside the built-ins.
In Node.js, a variable declared at the top level of a file is **not**
added to `global` — even though `setTimeout` and friends are sitting
right there on the same object:

```js
var message = '';
console.log(global.message); // undefined
```
*Full source: [global-scope-demo.js](/assets/code/module-system/global-scope-demo.js)*

![VS Code showing var message = ''; console.log(global.message); as the only two lines in app.js](/assets/images/global-object-message-undefined.png)

Running this in `app.js` prints `undefined`, not `''`. `message` exists,
but it's **file-scoped**: it belongs to `app.js` and only `app.js`. It
never touches the shared `global` object, which also means no other
file can see it — a second file sitting right next to `app.js` has no
way to reach `message` either, unless `app.js` explicitly exports it.

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
