const { EventEmitter } = require('node:events');

class Job extends EventEmitter {}

const job = new Job();
job.on('progress', (pct) => console.log(`${pct}%`));
job.once('done', () => console.log('finished')); // fires at most once
job.emit('progress', 50);
