---
type: Overview
title: How Node.js works
description: Why Node's single-threaded, non-blocking model lets it serve many concurrent clients, and why that same model makes it a poor fit for CPU-heavy work.
tags: [nodejs, getting-started, architecture]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: how-node-works-video
    resource: "training video (not retained in the bundle)"
    title: "How Node.js works (walkthrough)"
---

# Definition

Node.js applications are highly scalable because of a **non-blocking**
(asynchronous) architecture. Instead of dedicating a thread to a client
for the full duration of a request — including the time spent waiting on
a slow database or disk — Node hands off that wait to the system and
frees the thread to go serve someone else in the meantime.

# A restaurant metaphor

Picture two different restaurants:

- **Non-blocking restaurant.** A waiter takes your order and passes it to
  the kitchen. While the chef cooks, the waiter doesn't stand there
  watching — they go take another table's order. One waiter ends up
  serving many tables, because they never sit idle waiting on any single
  one.
- **Blocking restaurant.** A waiter is assigned to you, takes your order,
  hands it to the kitchen, and then just waits next to the kitchen until
  your meal is ready — not serving anyone else the whole time.

The waiter is a stand-in for a thread handling a request. In the
non-blocking restaurant, a single thread handles many requests by never
blocking on any one of them; in the blocking restaurant, one thread is
tied up per request for as long as that request takes.

# Blocking (synchronous) architecture

This is how frameworks like ASP.NET or Rails behave out of the box. A
request arrives, a thread is allocated to it, and if handling that
request means querying a database, the thread sits and waits for the
query to return before doing anything else. It can't be reused to serve
another client in the meantime.

The consequence shows up under load: with a large number of concurrent
clients, the pool of available threads runs out. New clients then have to
wait for a thread to free up — or the only fix is to throw more hardware
at the problem. Either way, the machine's resources aren't being used
efficiently, since most of that waiting thread's time is spent doing
nothing but waiting.

# Non-blocking (asynchronous) architecture

Node.js applications are asynchronous by default, with no extra work
required to get that behavior (in ASP.NET, by contrast, an async model is
possible but has to be deliberately opted into). Node uses a single
thread to handle *all* incoming requests:

1. A request arrives; the single thread starts handling it.
2. If the work requires querying a database (or any other I/O), the
   thread does **not** wait for it — it's freed to go handle another
   client.
3. When the database finishes and the result is ready, it's placed as a
   message on an **event queue**.
4. Node continuously monitors that queue in the background. When it finds
   a pending event, it picks it up and processes it — resuming whatever
   response the result belongs to.

This is the same hand-off described at the mechanical level in
[the event loop](/runtime/event-loop.md): the single JavaScript thread
never blocks on I/O, because libuv is doing the actual waiting and
reports back through that queue.

# Why this makes Node scalable

Because a single thread is never stuck waiting on disk or network
access, Node can serve far more concurrent clients per thread than a
blocking model can, without needing proportionally more hardware. This
makes it a strong fit for applications that are **data-intensive** and
**I/O-heavy**: lots of database queries, file reads, or network calls,
relative to the amount of raw computation involved.

# Where Node is a poor fit

The same single-threaded design that makes Node scale for I/O works
against it for **CPU-intensive** work — things like video encoding or
image manipulation, where an application spends most of its time doing
heavy calculation rather than waiting on disk or network. Since there's
only one thread running JavaScript, a long CPU-bound calculation blocks
that thread completely: it can't be handed off the way an I/O wait can,
so every other client has to wait for the calculation to finish before
the thread can get to them.

The practical guideline: Node.js should be used for data-intensive,
real-time applications, and avoided for CPU-intensive ones.

# Related

* [The event loop](/runtime/event-loop.md) — the mechanics behind the
  event queue described above: phases, microtasks, and what actually
  blocks it.
* [Node.js architecture](node-architecture.md) — how Node embeds the V8
  engine and its own runtime environment, one layer below the scheduling
  model described here.
* [What is Node.js?](what-is-node.md) — what Node is used for and why
  teams choose it, one level up from this concurrency model.
* [child_process](/api/child-process.md) — how to offload genuinely
  CPU-intensive work to another process instead of blocking Node's single
  thread.
