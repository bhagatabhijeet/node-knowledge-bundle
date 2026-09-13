const { Agent, get } = require('node:http');

const agent = new Agent({ keepAlive: true, maxSockets: 50 });
get('http://example.com', { agent }, (res) => { /* reuses pooled sockets */ });
