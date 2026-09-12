---
type: Runtime Concept
title: Buffers
description: Working with raw binary data.
tags: [nodejs, runtime, buffer, binary]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Definition

`Buffer` is Node.js's class for fixed-length raw binary data, predating
JavaScript's own `Uint8Array` (which `Buffer` now subclasses). Byte-mode
[streams](streams.md), the [fs](/api/fs.md) and
[http](/api/http.md) modules, and crypto APIs all read and write `Buffer`
instances.

# Creating buffers

```js
Buffer.alloc(10);            // 10 zero-filled bytes
Buffer.allocUnsafe(10);      // 10 uninitialized bytes — faster, may contain old memory
Buffer.from('hello', 'utf8');// from a string, given an encoding
Buffer.from([1, 2, 3]);      // from an array of bytes
```

`allocUnsafe` skips zero-filling for performance, but the returned memory
may contain leftover data from previous allocations. Only use it when the
buffer is immediately and fully overwritten before being read; otherwise it
can leak unrelated process memory into output, a real security issue in
network-facing code.

# Encodings

A buffer is just bytes; an **encoding** is required to interpret them as
text or convert text to bytes. Common encodings: `utf8` (default for
strings), `ascii`, `base64`, `hex`, `binary`/`latin1`.

```js
const buf = Buffer.from('café', 'utf8'); // 5 bytes: 'é' is 2 bytes in UTF-8
buf.toString('utf8');                    // 'café'
buf.toString('hex');                     // '636166c3a9'
```

Slicing a multi-byte character in half (e.g. via `buf.slice()` at the wrong
offset, or reassembling chunked stream data naively) produces corrupted
text — `Buffer.concat` on whole chunks before decoding avoids this.

# Comparison and equality

```js
Buffer.from('a').equals(Buffer.from('a')); // true, content comparison
Buffer.compare(bufA, bufB);                // -1, 0, or 1 — for sorting
```

Never use `===` between two distinct `Buffer` instances to compare content;
it compares object identity, not bytes.

# Related

* [Streams](streams.md) — the default chunk type in non-object-mode streams.
* [fs](/api/fs.md) — file contents are read as buffers unless an encoding
  is passed.
