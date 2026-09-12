process.on('exit', (code) => { /* only synchronous work allowed here */ });
process.on('uncaughtException', (err) => { /* last-resort; see below */ });
process.on('unhandledRejection', (reason) => { /* promise rejected, no .catch */ });
