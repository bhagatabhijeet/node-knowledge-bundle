---
type: Overview
title: What is Node.js?
description: What Node.js is, what it's used for, and why teams choose it for back-end services.
tags: [nodejs, getting-started]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: what-is-node-video
    resource: "training video (not retained in the bundle)"
    title: "What is Node.js? (introductory walkthrough)"
---

# Definition

Node.js is an open-source, cross-platform runtime environment for
executing JavaScript outside of a browser. Most commonly, it's used to
build the back-end services — APIs — that power client applications: a
web app running in a browser, or a mobile app on a phone. Those clients
are what a user directly sees and interacts with, but they still need to
talk to something on the server to store data, send emails, push
notifications, kick off workflows, and so on. Node.js is aimed squarely
at building that kind of highly scalable, data-intensive, real-time
back-end service.

# Why Node.js, specifically

Plenty of other stacks build back-end services — ASP.NET, Rails, and
others. A few things make Node.js a distinct choice:

- **Fast to start with, and scales up.** The same runtime that's easy to
  prototype in is also used to build large, highly scalable production
  services — it isn't a toy that gets outgrown. Large companies
  (PayPal, Uber, Netflix, Walmart, among others) run Node.js in
  production. PayPal in particular rebuilt a Java/Spring application on
  Node.js and reported it built roughly twice as fast, with fewer
  engineers, meaningfully less code (about a third fewer lines) and
  fewer files — and the resulting service handled roughly double the
  requests per second while cutting average response time by about a
  third.
- **One language, both sides of the stack.** Because the front end and
  back end can both be written in JavaScript, a front-end developer's
  existing skills transfer directly to building back-end services,
  without picking up a second language. It also means shared naming
  conventions, tooling, and practices across the whole codebase, rather
  than a seam where the language changes.
- **A large open-source ecosystem.** For most building blocks an
  application needs, there's already a well-used open-source package
  available via npm (see [package.json](/packaging/package-json.md)),
  so teams can focus on the application's actual logic instead of
  reimplementing common infrastructure from scratch.

# Remember

**Remember:** Node.js is the same runtime whether you're prototyping a
throwaway script or running PayPal's production traffic — when PayPal
rebuilt a Java/Spring service on Node, they shipped roughly twice as fast
with about a third less code and ended up handling double the requests
per second at noticeably lower latency. That's the whole pitch in one
data point: Node scales up, it isn't something you outgrow.

# Related

* [Node.js architecture](node-architecture.md) — how Node.js is built
  under the hood, and why it can handle so much concurrent I/O on a
  single thread.
* [package.json](/packaging/package-json.md) — how a Node.js project
  declares its dependencies on that open-source ecosystem.
* [Choosing a Node.js version](/playbooks/choosing-a-node-version.md) —
  which Node.js release to actually build on.
