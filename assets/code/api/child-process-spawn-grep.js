const { spawn } = require('node:child_process');

const child = spawn('grep', ['error', 'app.log']);
child.stdout.on('data', (chunk) => process.stdout.write(chunk));
child.on('close', (code) => console.log(`exited with ${code}`));
