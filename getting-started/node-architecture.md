---
type: Overview
title: Node.js architecture
description: How Node.js takes a browser's JavaScript engine out of the browser and wraps it in a standalone runtime with its own set of capabilities.
tags: [nodejs, getting-started, architecture]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: node-architecture-video
    resource: "training video (not retained in the bundle)"
    title: Node.js architecture walkthrough
---

# Definition

Before Node.js existed, JavaScript could only run inside a browser.
Every browser ships a **JavaScript engine** — the piece of software that
parses JavaScript and converts it into instructions a computer can
actually execute. Different browsers use different engines: Microsoft
Edge historically used Chakra, Firefox uses SpiderMonkey, and Chrome uses
**V8**. Because engines are separate implementations, the same
JavaScript code can occasionally behave slightly differently from one
browser to the next.

On top of its engine, a browser also hands JavaScript a **runtime
environment** — a set of objects that let code interact with the world
around it, such as `window` and `document`. Those objects are what let a
script query the page, react to clicks, and so on; they aren't part of
the JavaScript language itself, they're supplied by the browser.

# Taking the engine out of the browser

In 2009, Ryan Dahl (Node's creator) had a simple but pivotal idea: take a
JavaScript engine and run it *outside* a browser entirely. He picked
V8 — Chrome's engine, and the fastest one available — embedded it inside
a C++ program, and called that program `node`.

That means Chrome and Node.js literally embed the same V8 engine; the
JavaScript language semantics and performance characteristics you get in
one are, at the language level, the same as the other. What differs is
everything layered around the engine.

![Chrome and Node.exe both embed the same V8 engine](/assets/images/node-vs-chrome-v8.png)

# Same engine, different runtime environment

Just like a browser, Node.js pairs the V8 engine with its own runtime
environment — its own set of globals and built-in objects. But since
Node.js isn't running inside a browser tab, that environment looks
different:

| In a browser                          | In Node.js                                              |
|----------------------------------------|-----------------------------------------------------------|
| `window`, `document`                   | No DOM at all — there is no page to represent.            |
| Limited, sandboxed access to the machine | Direct access to the [file system](/api/fs.md).          |
| Can't open a network listener          | Can listen for requests on a given port (see [`http`](/api/http.md)). |

In short, Node.js swaps the browser-flavored globals for globals suited
to writing general-purpose programs: reading and writing files, talking
over the network, and other things a sandboxed browser script is
deliberately not allowed to do.

# What Node.js is not

The video is emphatic on two comparisons that are easy to reach for but
technically wrong:

* **Node.js is not a programming language.** It doesn't introduce new
  syntax or semantics — it's a program (written in C++, embedding V8)
  that happens to execute JavaScript. Comparing Node.js to C# or Ruby is
  comparing a runtime to a language; there's no useful comparison to
  make.
* **Node.js is not a framework.** Express, NestJS, and similar tools are
  frameworks *for* Node.js — they're built on top of it to make writing
  web applications more convenient. Node.js itself is one layer down:
  the runtime that gives JavaScript somewhere to execute outside a
  browser in the first place.

# Where this leaves the rest of the architecture

The pieces above — an embedded V8 engine plus a set of non-browser
globals — are what actually make something "Node.js." Everything else
commonly associated with Node's architecture, such as how it schedules
non-blocking I/O on a single thread, is a layer built on top of this
foundation rather than part of the engine itself; see
[the event loop](/runtime/event-loop.md) for how that scheduling
actually works.

# Related

* [What is Node.js?](what-is-node.md) — what Node.js is used for and why
  teams choose it, one level up from this internals view.
* [The event loop](/runtime/event-loop.md) — how Node.js schedules I/O
  and callbacks on top of the runtime described here.
* [http: servers and clients](/api/http.md) — one of the capabilities
  the Node.js runtime environment adds that a browser sandbox doesn't
  allow.
* [fs](/api/fs.md) — direct file system access, another Node-only
  runtime capability.
