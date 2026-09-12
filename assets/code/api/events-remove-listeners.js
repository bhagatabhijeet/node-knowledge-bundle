const handler = (data) => console.log(data);
emitter.on('data', handler);
emitter.off('data', handler); // or removeListener
emitter.removeAllListeners('data');
