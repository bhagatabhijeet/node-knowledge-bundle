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

![A number line from 1.2.3 to 2.0.0: ~1.2.3 covers only up to 1.3.0, while ^1.2.3 covers everything up to 2.0.0](/assets/images/semver-caret-vs-tilde.svg)

`^` is the default npm uses when running `npm install <pkg>`, and the most
common choice for application dependencies: it allows bug fixes and new
features but blocks breaking changes, assuming the dependency itself
follows semver correctly.

Side by side, the two operators resolve very differently for the same
starting version:

```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "express": "~4.19.2"
  }
}
```
*Full source: [semver-caret-vs-tilde.json](/assets/code/packaging/semver-caret-vs-tilde.json)*

`lodash` can jump all the way to `4.x` (up to `<5.0.0`); `express` can
only take patch updates (up to `<4.20.0`).

# `engines`

```json
{ "engines": { "node": ">=20.0.0" } }
```
*Full source: [semver-engines-field.json](/assets/code/packaging/semver-engines-field.json)*

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

# Remember

**Remember:** `^` doesn't mean "anything in the same major" — it means
no change to the *leftmost non-zero digit*, so for a pre-1.0 package like
`^0.4.2` that only allows patch bumps (`<0.5.0`), not the minor-version
freedom you'd get with `^1.4.2`. And a pre-release like `1.2.3-beta.1`
never matches a plain `^`/`~` range — you have to name it explicitly.

# Related

* [package.json](package-json.md) — where dependency ranges and `engines`
  are declared.
* [npm scripts](npm-scripts.md) — `npm version` bumps these numbers and
  runs lifecycle scripts around the bump.
