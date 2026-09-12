---
type: Playbook
title: Building your first Node.js program
description: Writing, running, and understanding a first Node.js script, and why it has no window or document.
tags: [nodejs, getting-started, tutorial]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: first-program-video
    resource: "training video (not retained in the bundle)"
    title: "Building your first Node.js program (walkthrough)"
---

# Set up a folder and a file

Create a new folder for the project, then open it in a code editor —
Visual Studio Code is a common, free choice, but any editor works. Inside
that folder, create a single file: `app.js`.

# Write regular JavaScript

A Node.js file is just JavaScript — the same language you'd write for a
browser, with the same functions, variables, and syntax:

```js
function sayHello(name) {
  console.log('Hello ' + name);
}

sayHello('Abhijeet');
```
*Full source: [say-hello.js](/assets/code/getting-started/say-hello.js)*

![Editing app.js: a sayHello function, and console.log(window) being typed with autocomplete open](/assets/images/first-node-app-code.png)

There's nothing Node-specific about this code yet — it's the function
definition and the call that matters, not any special API.

# Run it with node

Node.js code doesn't run by opening a file in a browser; it runs from the
terminal, by passing the file to the `node` command:

```
node app.js
```

This prints `Hello Abhijeet`. Mechanically, `node` is a C++ program that
embeds Chrome's V8 engine — see
[Node.js architecture](node-architecture.md) — so running `node app.js`
hands `app.js` to that embedded V8 engine for execution, the same engine
that would run the same syntax inside Chrome.

# No window, no document

Try replacing the call with `console.log(window)` and running the file
again:

```
node app.js
```

```
ReferenceError: window is not defined
```

![Terminal output: node app.js throws "ReferenceError: window is not defined"](/assets/images/first-node-app-window-error.png)

This is the concrete version of a point made elsewhere in this bundle:
`window` and `document` are not part of the JavaScript language — they're
supplied by a browser's runtime environment (see
[What is Node.js?](what-is-node.md)). Node.js pairs the same JavaScript
engine with a *different* runtime environment, one with no page to
represent, so browser globals like `window` simply don't exist. In their
place, Node.js provides objects for working with the file system, the
operating system, and the network — covered under
[API reference](/api/index.md).

# Related

* [What is Node.js?](what-is-node.md) — why Node's runtime environment
  differs from a browser's.
* [Node.js architecture](node-architecture.md) — the V8 engine that
  `node app.js` actually executes your code on.
* [Modules](/runtime/modules.md) — the next step once a program outgrows
  a single file.
* [fs](/api/fs.md) — one of the Node-only objects that replaces browser
  globals like `window`.
