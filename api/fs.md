---
type: API Reference
title: "fs: the filesystem module"
description: Reading, writing, and watching the filesystem.
resource: https://nodejs.org/api/fs.html
tags: [nodejs, api, fs, filesystem]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Three interfaces to the same operations

Nearly every `fs` operation is exposed three ways:

| Style       | Example                          | Notes                                   |
|-------------|-----------------------------------|-------------------------------------------|
| Callback    | `fs.readFile(path, cb)`           | Original API; never mix with sync calls in hot paths. |
| Synchronous | `fs.readFileSync(path)`           | Blocks the [event loop](/runtime/event-loop.md) until done — fine at startup, avoid in request handlers. |
| Promise     | `fsPromises.readFile(path)`       | `require('node:fs/promises')`; pairs with async/await. |

# Common operations

```js
const fs = require('node:fs/promises');

await fs.readFile('config.json', 'utf8');
await fs.writeFile('out.txt', data);
await fs.mkdir('logs', { recursive: true });
await fs.stat('file.txt'); // size, mtime, isDirectory(), ...
await fs.rm('tmp', { recursive: true, force: true });
```
*Full source: [fs-common-operations.js](/assets/code/api/fs-common-operations.js)*

# Streaming large files

Reading a whole file with `readFile` loads it entirely into memory.
For files that may be large, use a [stream](/runtime/streams.md) instead:

```js
fs.createReadStream('huge.log')
  .pipe(fs.createWriteStream('huge.log.copy'));
```
*Full source: [fs-stream-copy-pipe.js](/assets/code/api/fs-stream-copy-pipe.js)*

# Watching for changes

```js
fs.watch('config.json', (eventType, filename) => { /* 'change' | 'rename' */ });
```

`fs.watch` behavior (whether it fires, and with what event names) varies
across platforms and filesystem types (notably network filesystems); for
reliable cross-platform watching, many projects use a userland library
built on polling as a fallback.

# Paths

`fs` functions accept a `path`, a `Buffer`, a `file:` URL, or a file
descriptor number — but never construct those paths with unsanitized user
input without validating against directory traversal (`../`); see
[path](path.md) for safe path construction.

# Remember

**Remember:** the same `fs` operation comes in three shapes — callback,
sync, and promise — and picking the wrong one is how a request handler
quietly stalls every other in-flight request: `readFileSync` blocks the
[event loop](/runtime/event-loop.md) for everyone, not just the caller,
so save sync calls for startup code and reach for `node:fs/promises`
everywhere else.

# Related

* [path](path.md) — building the path strings passed to `fs`.
* [Streams](/runtime/streams.md) — `createReadStream`/`createWriteStream`.
* [Buffers](/runtime/buffers.md) — the default return type without an
  encoding.
