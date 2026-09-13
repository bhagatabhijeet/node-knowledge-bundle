// Operational: expected, recoverable -- handle it locally
fs.readFile('config.json', (err, data) => {
  if (err) return useDefaultConfig(); // e.g. ENOENT -- expected sometimes
});

// Programmer: a bug -- don't try to recover, let it crash
function getUserName(id) {
  return users[id].name; // throws if `id` isn't in `users` -- broken invariant
}
