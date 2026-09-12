readable.on('data', (chunk) => process(chunk));
readable.on('end', () => console.log('done'));
