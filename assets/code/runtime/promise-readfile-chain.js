const { readFile } = require('node:fs/promises');

readFile('/etc/hosts', 'utf8')
  .then((data) => console.log(data))
  .catch(handleError);
