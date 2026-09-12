const fs = require('node:fs/promises');

await fs.readFile('config.json', 'utf8');
await fs.writeFile('out.txt', data);
await fs.mkdir('logs', { recursive: true });
await fs.stat('file.txt'); // size, mtime, isDirectory(), ...
await fs.rm('tmp', { recursive: true, force: true });
