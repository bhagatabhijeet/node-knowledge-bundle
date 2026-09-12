const { request } = require('node:http'); // or require('node:https') for TLS

const req = request('http://example.com/api', { method: 'GET' }, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => console.log(data));
});
req.on('error', handleError); // network errors surface here, not via throw
req.end();
