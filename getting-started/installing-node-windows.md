---
type: Playbook
title: Installing Node.js on Windows
description: Checking for an existing Node.js install, picking a version, and installing or upgrading on Windows.
tags: [nodejs, getting-started, windows, installation]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
sources:
  - id: installing-node-video
    resource: "training video (not retained in the bundle)"
    title: "Installing Node.js (walkthrough)"
---

# Check what you already have

Before installing anything, check whether Node.js is already on the
machine, and which version. Open Command Prompt and run:

```
node --version
```

If Command Prompt reports the command isn't recognized, Node.js isn't
installed yet. If it prints a version number, Node.js is already
installed — but it may well be an old one, since this check doesn't tell
you whether it's current.

# Pick a version

Head to [nodejs.org](https://nodejs.org), which normally offers two
downloads side by side: the current **LTS** release and the **Current**
release.

![The nodejs.org homepage offering an LTS download next to a Current release](/assets/images/nodejs-org-lts-vs-current.png)

Unless you specifically need a bleeding-edge feature, install the **LTS**
build — it's the one recommended for most users. See
[choosing a Node.js version](/playbooks/choosing-a-node-version.md) for why
LTS is the safer default and how the release schedule works; the exact
version numbers on the download page will always be newer than whatever
appears in a given screenshot, so treat the page itself as the constant
and the numbers on it as a moving target.

# Install

On Windows, the download is a `.msi` installer. Run it and step through
the setup wizard: accept the license, keep the default install location
unless you have a reason to change it, and leave the option that adds
Node.js to your `PATH` checked — it's on by default, and without it,
Command Prompt won't be able to find `node` or `npm` afterward. Finish the
wizard to complete the install.

Installing over an existing Node.js version upgrades it in place; there's
no need to uninstall the old one first.

# Verify

Close and reopen Command Prompt — a window opened before the install
won't see the updated `PATH` — and check both `node` and its bundled
package manager:

```
node --version
npm --version
```

Both should now report the version you just installed. From inside a
running Node.js program, the same information is available as
[`process.version`](/runtime/process.md), without shelling out.

# Remember

**Remember:** grab **LTS**, not Current, unless you have a specific
reason not to — it's the build recommended for most users. And if
`node --version` still reports the old number right after you finish the
installer, you're almost certainly looking at a Command Prompt window
that was already open before install; close it and open a fresh one so it
picks up the updated `PATH`.

# Related

* [Choosing a Node.js version](/playbooks/choosing-a-node-version.md) —
  why LTS is the right default and how to enforce a version in a project.
* [What is Node.js?](what-is-node.md) — what you're installing, and why.
* [The process object](/runtime/process.md) — `process.version` and other
  runtime information available once Node.js is installed and running.
