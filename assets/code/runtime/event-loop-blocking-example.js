setTimeout(() => console.log('timer fired'), 0);

const start = Date.now();
while (Date.now() - start < 3000) {} // blocks everything for 3s

console.log('main thread finally free');
