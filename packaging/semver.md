---
type: Reference
title: Semantic versioning
description: How Node.js packages declare and constrain version ranges.
resource: https://semver.org
tags: [nodejs, npm, semver, versioning]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# The three numbers

A semver version is `MAJOR.MINOR.PATCH`, e.g. `2.14.3`:

- **MAJOR**: incremented for incompatible API changes.
- **MINOR**: incremented for backward-compatible new functionality.
- **PATCH**: incremented for backward-compatible bug fixes.

A `0.x.y` major version is, by convention, unstable: any `MINOR` bump may
break compatibility.

# Range operators in package.json

| Range     | Means                                      | Example matches for `1.2.3` |
|-----------|----------------------------------------------|-------------------------------|
| `1.2.3`   | Exact version only                          | `1.2.3`                       |
| `^1.2.3`  | Compatible: no change to the leftmost non-zero digit | `1.2.3` up to `<2.0.0`         |
| `~1.2.3`  | Approximately equivalent: patch-level only  | `1.2.3` up to `<1.3.0`         |
| `>=1.2.3` | Greater than or equal                       | `1.2.3` and above              |
| `1.x`, `*`| Wildcard                                     | any `1.y.z`, or any version    |

`^` is the default npm uses when running `npm install <pkg>`, and the most
common choice for application dependencies: it allows bug fixes and new
features but blocks breaking changes, assuming the dependency itself
follows semver correctly.

# `engines`

```json
{ "engines": { "node": ">=20.0.0" } }
```

Declares which Node.js versions a package supports. npm only warns (does
not block) on an `engines` mismatch by default; see
[choosing a Node.js version](/playbooks/choosing-a-node-version.md) for how
this interacts with the release schedule.

# Pre-release and build metadata

```
1.2.3-beta.1     # pre-release: sorts before 1.2.3
1.2.3+20260601   # build metadata: ignored for precedence comparisons
```

A pre-release version is excluded from a plain `^`/`~` range by default;
consumers that want to opt into pre-releases reference them explicitly.

# Related

* [package.json](package-json.md) — where dependency ranges and `engines`
  are declared.
* [npm scripts](npm-scripts.md) — `npm version` bumps these numbers and
  runs lifecycle scripts around the bump.
