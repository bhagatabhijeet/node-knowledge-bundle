---
type: API Reference
title: "http: servers and clients"
description: Building HTTP servers and clients.
resource: https://nodejs.org/api/http.html
tags: [nodejs, api, http, networking]
status: stable
generated: { by: reference_agent/claude-sonnet-5, at: 2026-09-12T00:00:00Z }
---

# A minimal server

```js
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('hello world');
});

server.listen(3000);
```
*Full source: [http-minimal-server.js](/assets/code/api/http-minimal-server.js)*

`req` is a readable [stream](/runtime/streams.md) (an
`IncomingMessage`); `res` is a writable stream (`ServerResponse`). Neither
`req` nor `res` buffers the body for you — reading a JSON request body
means collecting `'data'` chunks (or piping through a parser) until
`'end'`.

# Reading a request body

```js
let body = '';
req.on('data', (chunk) => (body += chunk));
req.on('end', () => {
  const parsed = JSON.parse(body); // guard with try/catch — see error handling
});
```
*Full source: [http-read-request-body.js](/assets/code/api/http-read-request-body.js)*

Frameworks (Express, Fastify, Koa) wrap this pattern; the low-level module
does not parse bodies, query strings, or routes for you.

# Making requests

```js
const { request } = require('node:http'); // or require('node:https') for TLS

const req = request('http://example.com/api', { method: 'GET' }, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => console.log(data));
});
req.on('error', handleError); // network errors surface here, not via throw
req.end();
```
*Full source: [http-make-request.js](/assets/code/api/http-make-request.js)*

For most application code, the higher-level `fetch()` global (available
built-in since Node.js 18) is simpler than `http.request` for one-shot
requests; reach for `http`/`https` directly when you need low-level
control (custom agents, streaming uploads, connection pooling tuning).

# Keep-alive and agents

An `http.Agent` manages connection pooling and keep-alive for outbound
requests. The default global agent keeps sockets open for reuse; under
high concurrency, tune `maxSockets` or supply a custom agent to avoid
exhausting file descriptors or hitting a remote host's connection limits.

```js
const { Agent, get } = require('node:http');

const agent = new Agent({ keepAlive: true, maxSockets: 50 });
get('http://example.com', { agent }, (res) => { /* reuses pooled sockets */ });
```
*Full source: [http-custom-agent.js](/assets/code/api/http-custom-agent.js)*

# Remember

**Remember:** the raw `http` module never hands you `req.body` — both
`req` and `res` are plain streams, so reading JSON means manually
collecting `'data'` chunks until `'end'` fires; that's exactly the gap
frameworks like Express fill for you, and it's why an outbound request
needs its own `req.on('error', ...)` listener or network failures never
surface at all.

# Related

* [Streams](/runtime/streams.md) — both `req` and `res` are streams.
* [Error handling](/runtime/error-handling.md) — request/response errors
  surface as `'error'` events, not thrown exceptions.
