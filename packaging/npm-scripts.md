---
type: Reference
title: npm scripts and lifecycle
description: Lifecycle scripts, npx, and workspaces.
resource: https://docs.npmjs.com/cli/v10/using-npm/scripts
tags: [nodejs, npm, scripts, workspaces]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# Defining and running scripts

Any entry under `"scripts"` in [package.json](package-json.md) becomes
runnable with `npm run <name>`:

```json
{
  "scripts": {
    "build": "tsc -p .",
    "test": "node --test",
    "start": "node dist/index.js"
  }
}
```

A handful of names are conventional shortcuts npm recognizes without
`run`: `npm start`, `npm test`, `npm stop`, `npm restart`.

# Lifecycle hooks

A script named `pre<name>` or `post<name>` runs automatically before or
after `<name>`:

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "tsc -p .",
    "postbuild": "node scripts/copy-assets.js"
  }
}
```

`npm run build` runs all three in order. This convention applies to any
script name, not just the npm-recognized shortcuts.

# `npx`

`npx <package>` runs a package's binary without a separate global install:
it checks local `node_modules/.bin` first, then falls back to a
temporary, cached download. Common for one-off tool invocations
(`npx create-vite@latest`) or running a project's own dependency binaries
directly (`npx eslint .`, equivalent to `./node_modules/.bin/eslint .`).

# Workspaces

Workspaces let one repository manage multiple packages with shared
dependency installation:

```json
{
  "name": "acme-monorepo",
  "private": true,
  "workspaces": ["packages/*"]
}
```

`npm install` at the root hoists shared dependencies once and symlinks
each workspace package into the root `node_modules`. `npm run build
--workspaces` runs a script across every workspace; `npm run build -w
packages/api` targets one.

# Related

* [package.json](package-json.md) — where `scripts` and `workspaces` are
  declared.
