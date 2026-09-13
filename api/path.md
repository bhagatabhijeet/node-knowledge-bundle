---
type: API Reference
title: "path: filesystem path manipulation"
description: Manipulating and normalizing filesystem paths.
resource: https://nodejs.org/api/path.html
tags: [nodejs, api, path, filesystem]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# join vs. resolve

The two most commonly confused functions:

```js
path.join('/a', 'b', '../c');     // '/a/c'  — concatenates, then normalizes
path.resolve('/a', 'b', '../c');  // '/a/c'  — same here, but...
path.resolve('a', 'b');           // '/cwd/a/b' — resolve() anchors to CWD
                                   //             for a relative first segment
path.join('a', 'b');              // 'a/b'       — join() never adds CWD
```
*Full source: [path-join-vs-resolve.js](/assets/code/api/path-join-vs-resolve.js)*

Use `path.resolve` when you need an absolute path (e.g. before passing to
[fs](fs.md) from user-relative input); use `path.join` when you only need
to combine segments and already have a base.

# Parsing and building

```js
path.parse('/home/user/file.txt');
// { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }

path.format({ dir: '/home/user', base: 'file.txt' }); // '/home/user/file.txt'
path.basename('/a/b/file.txt');       // 'file.txt'
path.extname('/a/b/file.txt');        // '.txt'
path.dirname('/a/b/file.txt');        // '/a/b'
```
*Full source: [path-parse-and-format.js](/assets/code/api/path-parse-and-format.js)*

# Cross-platform paths

`path` behaves differently by OS: `path.sep` is `/` on POSIX and `\` on
Windows, and drive letters (`C:\`) are only meaningful on Windows.
`path.posix` and `path.win32` give explicit access to either behavior
regardless of the host OS — useful when generating paths for a different
target platform (e.g. a URL or a path baked into a cross-platform config
file) or in tests that must be OS-independent.

```js
path.posix.join('a', 'b');  // always 'a/b'
path.win32.join('a', 'b');  // always 'a\\b'
```

# Security note

Never build a filesystem path by directly concatenating unsanitized user
input; `path.join`/`resolve` still normalize `../` segments, so an
attacker-supplied `../../etc/passwd` can escape an intended base
directory. Validate the resolved path stays within the expected root
(e.g. check it starts with `path.resolve(baseDir)`) before passing it to
[fs](fs.md).

```js
const resolved = path.resolve(baseDir, userInput);
if (!resolved.startsWith(path.resolve(baseDir) + path.sep)) {
  throw new Error('Path traversal attempt blocked');
}
```
*Full source: [path-validate-base-dir.js](/assets/code/api/path-validate-base-dir.js)*

# Remember

**Remember:** `path.join('a', 'b')` never looks at your current working
directory, but `path.resolve('a', 'b')` silently anchors to
`process.cwd()` the moment the first segment is relative — that mismatch
is why a script can behave differently depending on where it's launched
from, and why any path built from user input needs an explicit check
that it still starts with `path.resolve(baseDir)` before it reaches
[fs](fs.md).

# Related

* [fs](fs.md) — the primary consumer of `path` output.
