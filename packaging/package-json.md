---
type: Reference
title: package.json
description: The manifest that describes a Node.js package, including how to enable ES6 modules with the type field.
resource: https://docs.npmjs.com/cli/v10/configuring-npm/package-json
tags: [nodejs, npm, package-json, packaging]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Schema

| Field             | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `name`, `version`  | Identity, following [semver](semver.md).                                |
| `type`            | `"module"` (ESM) or `"commonjs"` (CommonJS); determines how `.js` files are interpreted. **Use `"type": "module"` for new projects.** |
| `main`            | CommonJS entry point (legacy; superseded by `exports` for new packages). |
| `exports`         | Explicit map of public entry points; see [modules](/runtime/modules.md). |
| `scripts`         | Named shell commands run via `npm run`; see [npm scripts](npm-scripts.md). |
| `dependencies`    | Packages required at runtime.                                           |
| `devDependencies` | Packages required only for development/build/test.                      |
| `peerDependencies`| Packages the consumer is expected to provide (common for plugins).       |
| `engines`         | Declares supported Node.js/npm version ranges; see [choosing a Node.js version](/playbooks/choosing-a-node-version.md). |
| `bin`             | Maps command names to executable scripts, for CLI packages.             |
| `files`           | Allowlist of paths included when the package is published.              |
| `private`         | `true` prevents accidental `npm publish`.                               |

# A minimal example — using ES6 modules (recommended)

```json
{
  "name": "acme-lib",
  "version": "1.4.0",
  "type": "module",
  "exports": "./index.js",
  "engines": { "node": ">=20" },
  "scripts": {
    "test": "node --test",
    "build": "tsc -p ."
  },
  "dependencies": {
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```
*Full source: [package-json-minimal-example.json](/assets/code/packaging/package-json-minimal-example.json)*

The `"type": "module"` field tells Node.js to treat all `.js` files in this package as ES6 modules (ESM), enabling `import`/`export` syntax.

# The `type` field: Choosing your module system

The `"type"` field in `package.json` determines which module format Node.js uses for `.js` files:

| Value | Effect | Recommendation |
|-------|--------|---|
| `"module"` | Treat `.js` files as ES6 modules (ESM) | ✅ **Recommended for new projects** |
| `"commonjs"` | Treat `.js` files as CommonJS | Use for legacy projects or when packages require it |
| *(omitted)* | Default to CommonJS | Legacy default |

**For new projects, always set `"type": "module"`.** This enables modern JavaScript with `import`/`export`, provides better tooling support, and aligns with the official Node.js recommendation.

```json
{
  "name": "my-new-app",
  "type": "module"
}
```

When `"type": "module"` is set, you can use ES6 syntax directly:

```js
// index.js (no .mjs needed)
import express from 'express';

const app = express();
app.listen(3000);
```

If you need a single file to use the other module system, use the corresponding file extension:
- `.mjs` files are always treated as ESM
- `.cjs` files are always treated as CommonJS

# Lockfiles

`package.json` declares dependency **ranges**; a lockfile
(`package-lock.json` for npm, `yarn.lock`, `pnpm-lock.yaml`) records the
exact resolved versions installed, so builds are reproducible across
machines and time. Always commit the lockfile for applications;
libraries typically commit it too, for reproducible CI, even though
consumers resolve their own ranges.

The `"zod": "^3.23.0"` range above resolves to one exact, pinned entry
in the lockfile:

```json
{
  "node_modules/zod": {
    "version": "3.23.4",
    "resolved": "https://registry.npmjs.org/zod/-/zod-3.23.4.tgz"
  }
}
```
*Full source: [package-json-lockfile-entry.json](/assets/code/packaging/package-json-lockfile-entry.json)*

# Remember

**Remember:**
- **For new projects, set `"type": "module"`** to use ES6 modules (`import`/`export`). This is the official Node.js recommendation.
- `package.json` only ever declares dependency *ranges* — the exact versions your build actually gets come from the lockfile, so if you don't commit `package-lock.json`, "reproducible build" is just a hope, not a guarantee.
- File extensions always override the `type` field — `.mjs` is always ESM and `.cjs` is always CommonJS, regardless of `"type"`.

# Related

* [Modules](/runtime/modules.md) — `type` and `exports` in depth, including CommonJS vs ESM comparison and interoperability.
* [Semantic versioning](semver.md) — how dependency ranges are written.
* [npm scripts](npm-scripts.md) — the `scripts` field in depth.
