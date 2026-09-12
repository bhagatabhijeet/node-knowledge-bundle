// parent.js
const { fork } = require('node:child_process');
const child = fork('./worker.js');
child.send({ task: 'process', payload: [1, 2, 3] });
child.on('message', (result) => console.log(result));

// worker.js
process.on('message', (msg) => {
  process.send({ result: msg.payload.length });
});
