// Serial: ~300ms total -- each await waits for the previous one to finish
const a = await fetchA();
const b = await fetchB();

// Concurrent: ~100ms total -- both requests run at the same time
const [x, y] = await Promise.all([fetchA(), fetchB()]);
