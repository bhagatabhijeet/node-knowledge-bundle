---
type: Runtime Concept
title: Modules (CommonJS and ESM)
description: CommonJS and ECMAScript modules, and how Node.js resolves and interops between them.
tags: [nodejs, runtime, modules, commonjs, esm]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Two module systems

Node.js supports two module formats:

- **CommonJS (CJS)**: `require()` / `module.exports`, resolved and executed
  synchronously. The original Node.js module system.
- **ECMAScript Modules (ESM)**: `import` / `export`, the standard JavaScript
  module system, resolved and linked asynchronously, statically analyzable.

# Which one a file uses

Node.js picks a format per file using, in order:

1. The file extension: `.mjs` is always ESM, `.cjs` is always CommonJS.
2. For `.js`, the nearest ancestor `package.json`'s `"type"` field:
   `"type": "module"` → ESM, `"type": "commonjs"` or absent → CommonJS.

```json
{ "name": "acme-lib", "type": "module" }
```
*Full source: [package-json-type-module.json](/assets/code/runtime/package-json-type-module.json)*

# package.json `exports`

The `exports` field in [package.json](/packaging/package-json.md) declares a
package's public entry points explicitly, instead of exposing the whole file
tree:

```json
{
  "exports": {
    ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" },
    "./package.json": "./package.json"
  }
}
```
*Full source: [package-json-exports.json](/assets/code/runtime/package-json-exports.json)*

A package with `exports` can ship **dual** builds — separate ESM and CJS
entry points — so consumers on either module system resolve to a working
file. Any path not listed in `exports` becomes unimportable from outside the
package (Node.js enforces this as "package exports encapsulation").

# Interop

- ESM can `import` a CommonJS module; the CJS `module.exports` value becomes
  the default export, and Node.js performs best-effort static analysis to
  also expose named exports.
- CommonJS cannot `require()` a pure ESM module synchronously (ESM linking
  is asynchronous). It must use the dynamic `import()` expression, which
  returns a promise.
- `require(esm)` support exists in newer Node.js versions for synchronous,
  non-top-level-await ESM graphs, but is not a full substitute for
  `import()` when the graph uses top-level `await`.

# Resolution basics

- Relative specifiers (`./foo.js`, `../bar.js`) resolve relative to the
  importing file. ESM requires the extension; CommonJS can omit it.
- Bare specifiers (`lodash`, `@scope/pkg`) resolve by walking up
  `node_modules` directories, same for both systems.
- `node:` prefixed specifiers (`node:fs`, `node:path`) always resolve to a
  built-in module, bypassing `node_modules` entirely; this is the
  recommended way to reference built-ins.

# Related

* [package.json](/packaging/package-json.md) documents `"type"`, `"main"`,
  and `"exports"` in full.
* [Async patterns](async-patterns.md) covers why ESM's asynchronous linking
  matters for top-level `await`.
