---
type: API Reference
title: "os: operating system information"
description: Accessing platform and runtime details such as CPU counts, memory, uptime, temp directories, and environment variables.
resource: https://nodejs.org/api/os.html
tags: [nodejs, api, os, operating-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# What `os` gives you

The `os` module exposes operating-system information that is useful for
configuring runtime behavior, probing the machine, and understanding the
current environment. It is not a file-system API; it tells you about the
platform around the process.

Common examples include:

- CPU architecture and count
- total/free memory
- process uptime
- home directory and temp directory
- host name and user info
- environment variables

# Quick examples

```js
const os = require('node:os');

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus().length);
console.log(os.totalmem());
console.log(os.freemem());
console.log(os.homedir());
console.log(os.tmpdir());
console.log(os.hostname());
console.log(os.uptime());
console.log(os.userInfo());
```

These values are useful in scripts that need to decide how many worker
threads to use, where to place temporary files, or which runtime
configuration should vary by machine.

# CPU and memory

```js
const os = require('node:os');

const cpus = os.cpus();
const totalMem = os.totalmem();
const freeMem = os.freemem();

console.log(`CPU cores: ${cpus.length}`);
console.log(`Total RAM: ${totalMem / 1024 / 1024 / 1024} GB`);
console.log(`Free RAM: ${freeMem / 1024 / 1024 / 1024} GB`);
```

This is often used in system dashboards, load-balancing heuristics, or
choosing between serial and parallel work based on available resources.

# Environment and home directory

```js
const os = require('node:os');

console.log(process.env.NODE_ENV);
console.log(os.homedir());
console.log(os.tmpdir());
```

`os.homedir()` tells you where the current user's home directory lives,
while `os.tmpdir()` returns the temporary-directory location for the
platform. These are often used when creating caches, temporary files, or
user-scoped config paths.

# A note on `process.env`

`os` does not itself read environment variables; those live on
`process.env`. The `os` module helps you discover the runtime platform,
while the process object exposes the active environment for the current
Node.js process.

```js
console.log(process.env.PATH);
console.log(process.env.USERPROFILE || process.env.HOME);
```

# Remember

**Remember:** `os` is the module that tells you about the machine the
process is running on — memory, CPUs, hostname, platform, temp folders,
and user directory. It answers “what environment am I inside?” while
`process.env` answers “what variables did this process inherit?”

# Related

* [process](/runtime/process.md) — the `process` object for environmental
  and runtime state.
* [fs](fs.md) — the filesystem API that often uses `os.tmpdir()` or
  `os.homedir()` when creating files.
* [path](path.md) — path manipulation that often combines OS-specific
  directories and file system locations.
