const fs = require('fs');

const data = fs.readFileSync('notes.txt', 'utf8'); // blocks here

fs.readFile('notes.txt', 'utf8', (err, data) => {
  console.log(data); // runs later; the thread was free meanwhile
});
