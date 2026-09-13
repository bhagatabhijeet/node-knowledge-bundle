# Built-in Node.js Modules

Node.js ships with a large standard library of built-in modules that provide core functionality out of the box: filesystem access, networking, streams, OS information, crypto, timing, and more. These modules are available without installing any package from npm.

## Core built-in modules

### File system and paths

* `node:fs` — File system operations
* `node:fs/promises` — Promise-based file system APIs
* `node:path` — Path manipulation helpers
* `node:path/posix` — POSIX path behavior
* `node:path/win32` — Windows path behavior

### Network and HTTP

* `node:http` — HTTP server and client APIs
* `node:https` — HTTPS server and client APIs
* `node:http2` — HTTP/2 support
* `node:net` — Low-level TCP networking
* `node:tls` — TLS/SSL support
* `node:dns` — DNS lookup APIs
* `node:dns/promises` — Promise-based DNS APIs
* `node:udp` — Legacy UDP alias in older Node versions; modern usage is usually through `dgram` (if present in the runtime)
* `node:dgram` — Datagram sockets

### Events, streams, and data

* `node:events` — Event-driven programming via `EventEmitter`
* `node:stream` — Stream primitives and transforms
* `node:stream/consumers` — Helpers for consuming streams
* `node:stream/promises` — Promise-based stream utilities
* `node:stream/web` — Web Streams API support
* `node:buffer` — Binary data utilities
* `node:string_decoder` — Decode byte streams into strings
* `node:querystring` — Parse and stringify URL query strings
* `node:url` — URL parsing and formatting
* `node:util` — General-purpose utilities
* `node:util/types` — Type validation helpers
* `node:assert` — Assertion helpers for tests and validation
* `node:assert/strict` — Strict assertion mode
* `node:console` — Console output APIs
* `node:timers` — `setTimeout`, `setInterval`, `setImmediate`
* `node:timers/promises` — Promise-based timer APIs
* `node:perf_hooks` — Performance measurement hooks

### Process, OS, and runtime

* `node:os` — Operating system information and utilities
* `node:process` — Process object and environment access
* `node:tty` — Terminal I/O handling
* `node:readline` — Read input line by line
* `node:readline/promises` — Promise-based readline helpers
* `node:repl` — Read-eval-print loop
* `node:inspector` — Debugger integration
* `node:module` — Module loading internals
* `node:v8` — V8 engine information and tuning
* `node:vm` — Script compilation and execution contexts
* `node:wasi` — WebAssembly System Interface
* `node:worker_threads` — Worker threads for multi-threaded JS
* `node:cluster` — Process clustering
* `node:child_process` — Spawn and communicate with subprocesses
* `node:diagnostics_channel` — Diagnostic channels for instrumentation
* `node:trace_events` — Trace event APIs

### Security, crypto, and encoding

* `node:crypto` — Cryptography and hashing
* `node:tls` — TLS/SSL support
* `node:punycode` — Unicode encoding support (legacy)
* `node:buffer` — Binary buffers
* `node:constants` — Common OS constants

### Data and serialization

* `node:zlib` — Compression and decompression
* `node:serialport` — Not a core module; belongs to an external package
* `node:sqlite` — Experimental/optional in newer Node releases, not a universal core module across all Node versions

### Legacy and lower-level modules

* `node:domain` — Legacy error handling API (deprecated)
* `node:sys` — Aliased to `util` in modern Node.js
* `node:punycode` — Legacy encoding support
* `node:constants` — Shared OS constants

## Standard module names you will see most often

These are the ones most Node.js developers use daily:

* `fs` / `fs/promises`
* `path`
* `http` / `https`
* `events`
* `stream`
* `url`
* `util`
* `os`
* `process`
* `crypto`
* `child_process`
* `timers`
* `zlib`
* `net`
* `tls`

## Best practice

Prefer the `node:` prefix when explicitly importing built-ins:

```js
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
```

This makes it clear that the module is a Node.js core module, avoids ambiguity with npm packages, and matches the modern recommendation.

## Memory aid for beginners: “Fast Pirates Hunt Exotic Ships, Then Use Orange Pizzas, Cooked To Delicious Zest.”

This silly sentence helps you remember the modules you use most often:

- `fs` = Fast
- `path` = Pirates
- `http` = Hunt
- `events` = Exotic
- `stream` = Ships
- `timers` = Then
- `url` = Use
- `os` = Orange
- `process` = Pizzas
- `console` = Cooked
- `crypto` = To
- `dns` = Delicious
- `zlib` = Zest

A cartoon version looks like this:

```text
       ___        ___        ___        ___
      /   \______/   \______/   \______/   \
      | fs |  path | http | events | stream |
      \___/      \___/      \___/      \___/
          \           |            /
           \__ timers -> url -> os -> process -> console -> crypto -> dns -> zlib

      "Fast Pirates Hunt Exotic Ships, Then Use Orange Pizzas, Cooked To Delicious Zest!"
```

The idea is not to memorize every core module perfectly. The goal is to remember the main groups: filesystem, networking, events, streams, runtime, and utilities.

## Related

* [api/index.md](../api/index.md) — The main API reference section for Node.js built-ins
* [api/fs.md](../api/fs.md) — File system operations
* [api/http.md](../api/http.md) — HTTP server and client usage
* [api/path.md](../api/path.md) — Path manipulation
* [api/events.md](../api/events.md) — Event-driven programming
* [api/timers.md](../api/timers.md) — Timers and scheduling
