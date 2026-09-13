---
type: Overview
title: Introduction to the module system
description: A roadmap for this topic -- what modules are, why Node.js needs them, and which core modules are covered.
tags: [nodejs, module-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: module-system-intro-video
    resource: "training video (not retained in the bundle)"
    title: "Node module system (section introduction)"
---

# What this topic covers

Node.js runs each file as its own isolated module rather than sharing one
global scope the way a browser's `<script>` tags do. This topic covers
what a module is, why that isolation exists, and how to work with it:

* **Why modules exist** — starting from the concrete symptom (a variable
  that quietly isn't where you'd expect it) in
  [the global object](global-object.md).
* **The core modules built into Node.js** — the standard library that
  ships with the runtime itself. This bundle already covers several of
  them in depth: the file system ([fs](/api/fs.md)), events
  ([events](/api/events.md)), and networking ([http](/api/http.md)); an
  operating-system module (`os`) isn't covered yet.
* **Writing your own modules** — splitting code across files and sharing
  specific pieces between them on purpose, rather than relying on a
  shared global scope. The mechanics of that — `require`, `module.exports`,
  `import`/`export` — are covered in [Modules](/runtime/modules.md).

# Related

* [The global object](global-object.md) — the next doc in this topic.
* [Modules](/runtime/modules.md) — how CommonJS and ESM actually implement
  per-file scope and sharing.
* [Building your first Node.js program](/getting-started/building-first-node-program.md)
  — where the file-scoping behavior this topic explains was first
  demonstrated.
