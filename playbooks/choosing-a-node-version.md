---
type: Playbook
title: Choosing a Node.js version
description: Reading the release schedule and picking a version to target.
resource: https://github.com/nodejs/release#release-schedule
tags: [nodejs, playbook, releases, lts]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# The release model

Node.js ships a new **major** version every six months (April and
October). Every *even*-numbered major (18, 20, 22, 24, ...) is promoted to
**Long Term Support (LTS)** roughly six months after its initial release;
odd-numbered majors (19, 21, 23, ...) are "Current" only and never become
LTS. An LTS line moves through three stages:

| Stage             | Meaning                                                        |
|-------------------|-------------------------------------------------------------------|
| Current           | Newest features, released every 6 months; not yet LTS.            |
| Active LTS        | Recommended for most production use; receives features, fixes, and security patches. |
| Maintenance LTS   | Critical bug fixes and security patches only, no new features.    |
| End-of-life (EOL) | No further updates of any kind; upgrade is overdue.                |

Each LTS line gets roughly 30 months of combined Active + Maintenance
support from its initial release. Always check the authoritative,
continuously updated schedule rather than a hardcoded date, since exact
cutoffs shift: <https://github.com/nodejs/release#release-schedule>.

# Picking a version

- **New projects**: target the current Active LTS line. It has the widest
  ecosystem/tooling support and the longest remaining support window.
- **Existing projects**: stay on an Active or Maintenance LTS line;
  schedule an upgrade before it reaches EOL, since an EOL runtime stops
  receiving security patches.
- **Libraries**: support the widest reasonable range of LTS lines your
  users still run, declared via [`engines`](/packaging/package-json.md)
  in package.json — check it, don't just assert the newest version.
- Avoid deploying an odd-numbered ("Current," non-LTS) major to
  production; it's meant for trying upcoming features, not for
  long-running services.

# Enforcing a version in a project

```json
{ "engines": { "node": ">=22.0.0 <25.0.0" } }
```
*Full source: [choosing-node-version-engines.json](/assets/code/playbooks/choosing-node-version-engines.json)*

npm only warns on an `engines` mismatch by default; combine it with a
`.nvmrc` (for `nvm`/`fnm` users) and a CI check
(`node -e "process.exit(require('semver').satisfies(process.version, require('./package.json').engines.node) ? 0 : 1)"`)
if the constraint must be enforced rather than advisory.

# Related

* [package.json](/packaging/package-json.md) — the `engines` field.
* [Semantic versioning](/packaging/semver.md) — how the version range
  syntax itself works.
