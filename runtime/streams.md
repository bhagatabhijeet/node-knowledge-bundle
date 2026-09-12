---
type: Runtime Concept
title: Streams
description: Reading and writing data incrementally, and handling backpressure.
tags: [nodejs, runtime, streams, backpressure]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Definition

A stream processes data in chunks rather than loading it entirely into
memory, which is what makes it possible to handle files or network payloads
much larger than available RAM. Node.js streams are `EventEmitter`s
(see [events](/api/events.md)) that come in four kinds:

| Kind        | Direction                      | Examples                              |
|-------------|----------------------------------|----------------------------------------|
| `Readable`  | Source of data                 | `fs.createReadStream`, an HTTP request on the server side |
| `Writable`  | Destination for data           | `fs.createWriteStream`, an HTTP response |
| `Duplex`    | Both, independently             | a TCP socket                          |
| `Transform` | Both, output derived from input | `zlib.createGzip`, `crypto` ciphers    |

# Reading

Readable streams support two modes: **flowing** (data pushed via `'data'`
events as fast as it arrives) and **paused** (pulled explicitly via
`.read()`). Mixing the two without care is a common source of dropped data.

```js
readable.on('data', (chunk) => process(chunk));
readable.on('end', () => console.log('done'));
```

# Piping and backpressure

`.pipe()` connects a readable to a writable and automatically manages
**backpressure**: if the writable's internal buffer fills up faster than it
can drain (e.g. writing to a slow disk while reading from a fast network
socket), `.pipe()` pauses the readable until the writable emits `'drain'`.
Without this, an unbounded amount of data could buffer in memory.

```js
const { pipeline } = require('node:stream/promises');

await pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('input.txt.gz'),
);
```

`pipeline` (over raw `.pipe()`) is the recommended way to connect streams:
it forwards errors from any stage and guarantees every stream in the chain
is properly destroyed on failure, which manual `.pipe()` chains do not do
by default.

# Object mode

By default, streams operate on `Buffer`/string chunks. `{ objectMode: true }`
lets a stream carry arbitrary JavaScript values instead — useful for
building processing pipelines over structured records rather than raw
bytes.

# Related

* [Buffers](buffers.md) — the default chunk type for byte-mode streams.
* [http](/api/http.md) — both the request and response objects are streams.
* [fs](/api/fs.md) — `createReadStream`/`createWriteStream` are the most
  common stream entry points.
