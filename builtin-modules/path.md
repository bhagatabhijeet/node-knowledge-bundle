---
type: API Reference
title: Path Module
description: Working with file and directory paths in a cross-platform way using the path module. Includes methods like join(), resolve(), basename(), dirname(), and more.
tags: [nodejs, api, path, file-system]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-13T00:00:00Z }
resource: https://nodejs.org/docs/latest/api/path.html
---

# The Path Module

The `path` module provides utilities for working with file and directory paths. 
It handles differences between Windows and POSIX (Linux/macOS) path formats 
automatically, so your code works consistently across platforms.

**Why use it?** Paths are tricky — Windows uses backslashes (`\`), Unix uses 
forward slashes (`/`), and hard-coding paths makes your code platform-specific. 
The `path` module normalizes this for you.

# Getting started

Import the path module using CommonJS or ES6:

```js
// CommonJS
const path = require('path');

// ES6 modules (with "type": "module" in package.json)
import path from 'path';
```

All examples below use CommonJS syntax with `const path = require('path');`.

# Working with path parts

Paths can be broken down into meaningful parts: the directory, the filename, 
the extension. The `path` module gives you tools to work with each.

## `path.basename(path[, ext])`

Returns the **last portion of a path** — the filename.

### Without extension removal

```js
const path = require('path');

console.log(path.basename('/home/user/documents/resume.pdf'));
// Output: 'resume.pdf'

console.log(path.basename('C:\\Users\\John\\file.txt'));
// Output: 'file.txt' (works on any platform)
```

### With extension removal

Remove the file extension by passing it as a second argument:

```js
console.log(path.basename('/home/user/documents/resume.pdf', '.pdf'));
// Output: 'resume'

console.log(path.basename('config.json', '.json'));
// Output: 'config'
```

**Use case:** Extract just the filename when processing files, or get the name 
without the extension for renaming operations.

## `path.dirname(path)`

Returns the **directory path**, everything except the filename.

```js
const path = require('path');

console.log(path.dirname('/home/user/documents/resume.pdf'));
// Output: '/home/user/documents'

console.log(path.dirname('src/utils/helpers.js'));
// Output: 'src/utils'
```

**Use case:** Extract the folder path when you need to save related files to 
the same directory.

## `path.extname(path)`

Returns the **file extension**, from the last dot (`.`) to the end.

```js
console.log(path.extname('index.html'));
// Output: '.html'

console.log(path.extname('archive.tar.gz'));
// Output: '.gz' (only the last extension)

console.log(path.extname('README'));
// Output: '' (empty string — no extension)
```

**Use case:** Filter files by type (`if (path.extname(file) === '.json')`), 
or determine how to process a file based on its extension.

## `path.parse(path)`

Breaks a **complete path into an object** with its component parts.

```js
console.log(path.parse('/home/user/dir/file.txt'));
```

Output:
```js
{
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
```

**What each part means:**
- `root` — The root of the path (`/` on Unix, `C:\` on Windows)
- `dir` — The directory (everything except the filename)
- `base` — The filename with extension
- `ext` — The file extension (`.txt`)
- `name` — The filename without extension (`file`)

**Use case:** When you need all parts of a path at once, or to rebuild 
a path with modifications.

## `path.format(pathObject)`

The **reverse of `path.parse()`** — turns an object back into a path string.

```js
const pathObject = {
  dir: '/home/user/documents',
  base: 'resume.pdf'
};

console.log(path.format(pathObject));
// Output: '/home/user/documents/resume.pdf'
```

You can construct paths programmatically:

```js
const filePath = path.format({
  dir: '/output',
  name: 'result',
  ext: '.json'
});
console.log(filePath);
// Output: '/output/result.json'
```

**Use case:** Dynamically build file paths by combining directory, name, 
and extension.

# Joining and resolving paths

## `path.join([...paths])`

**Joins path segments** together using the platform-specific separator.

```js
const path = require('path');

console.log(path.join('/foo', 'bar', 'baz'));
// Output: '/foo/bar/baz'

console.log(path.join('src', 'utils', 'helpers.js'));
// Output: 'src/utils/helpers.js'

console.log(path.join('/foo', '..', 'bar'));
// Output: '/bar' (handles .. to go up directories)
```

**Key features:**
- Handles platform differences automatically (`/` or `\`)
- Resolves `.` and `..` segments
- Removes duplicate slashes

**Use case:** Build file paths dynamically without worrying about separators.

### Practical example: Build a data file path

```js
const path = require('path');

const dataDir = 'data';
const filename = 'users.json';

const filePath = path.join(dataDir, filename);
console.log(filePath);
// Output: 'data/users.json'
```

## `path.resolve([...paths])`

**Resolves to an absolute path** (starting from root).

```js
const path = require('path');

// From current working directory (assume: /home/user/project)
console.log(path.resolve('src', 'index.js'));
// Output: '/home/user/project/src/index.js'

console.log(path.resolve('/etc', 'config', '.', 'file.txt'));
// Output: '/etc/config/file.txt'

console.log(path.resolve('src', '..', 'app.js'));
// Output: '/home/user/project/app.js'
```

**Difference from `path.join()`:**
- `path.join()` joins segments but keeps relative paths relative
- `path.resolve()` always returns an absolute path

### When to use each

| Method | Input | Output | Use for |
|--------|-------|--------|---------|
| `path.join()` | `'src', 'app.js'` | `'src/app.js'` | Relative paths, building file references |
| `path.resolve()` | `'src', 'app.js'` | `'/home/user/project/src/app.js'` | Absolute paths, file system operations |

**Use case:** Use `path.resolve()` when you need the full absolute path for 
file I/O operations, or when you need to ensure a path is absolute.

### Practical example: Build an absolute path for file reading

```js
const path = require('path');
const fs = require('fs');

// Build absolute path to a config file
const configPath = path.resolve('config', 'settings.json');
console.log(configPath); // '/full/path/to/config/settings.json'

// Use it with fs to read the file
const data = fs.readFileSync(configPath, 'utf8');
```

## `path.normalize(path)`

**Cleans up a path** by resolving `.` and `..` and removing duplicate slashes.

```js
console.log(path.normalize('/foo/bar//baz/asdf/quux/..'));
// Output: '/foo/bar/baz/asdf'

console.log(path.normalize('foo/bar/./baz'));
// Output: 'foo/bar/baz'
```

**Use case:** Normalize messy paths before using them, or when building paths 
that might have redundant segments.

# Platform-specific constants

## `path.sep`

The platform-specific path **separator**:

```js
console.log(path.sep);
// On Windows: '\\'
// On Unix/Linux/macOS: '/'
```

**Use case:** Rarely needed, but useful if you're parsing paths manually.

## `path.delimiter`

The platform-specific path **delimiter** (used in `PATH` environment variable):

```js
console.log(path.delimiter);
// On Windows: ';'
// On Unix/Linux/macOS: ':'
```

**Use case:** When working with the `PATH` environment variable or splitting 
multiple paths.

### Example: Parse the PATH environment variable

```js
const path = require('path');

const paths = process.env.PATH.split(path.delimiter);
console.log(paths);
// Output: Array of all directories in the PATH
```

# Common use cases

## Use case 1: Check if a file has a specific extension

```js
const path = require('path');

function isJsonFile(filename) {
  return path.extname(filename) === '.json';
}

console.log(isJsonFile('config.json'));    // true
console.log(isJsonFile('readme.md'));      // false
```

## Use case 2: Build file paths dynamically

```js
const path = require('path');

const uploadDir = 'uploads';
const userId = '12345';
const filename = 'avatar.png';

const userUploadPath = path.join(uploadDir, userId, filename);
console.log(userUploadPath);
// Output: 'uploads/12345/avatar.png'
```

## Use case 3: Extract filename without extension

```js
const path = require('path');

function getFileNameWithoutExt(filepath) {
  const basename = path.basename(filepath);
  const name = path.parse(filepath).name;
  return name;
}

console.log(getFileNameWithoutExt('/home/user/document.pdf'));
// Output: 'document'
```

## Use case 4: Get absolute path for file operations

```js
const path = require('path');
const fs = require('fs');

// Relative to current working directory
const configFile = path.resolve('config', 'app.json');

if (fs.existsSync(configFile)) {
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  console.log('Config loaded:', config);
}
```

# Remember

**Remember:**
- **Use `path.join()` for relative paths** and building file references
- **Use `path.resolve()` for absolute paths** and file I/O operations
- **The `path` module handles platform differences** — don't hard-code `/` or `\`
- **Use `path.parse()` to decompose a path** into its parts, and `path.format()` to reconstruct it
- **Always prefer the `path` module over string manipulation** to avoid cross-platform issues

# Related

* [File System (fs)](/builtin-modules/fs.md) — Read, write, and work with files
* [Building your first Node.js program](/getting-started/building-first-node-program.md) — where file paths first appear
* [Modules](/runtime/modules.md) — module resolution and how Node.js finds files
