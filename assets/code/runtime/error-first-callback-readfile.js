fs.readFile('/etc/hosts', 'utf8', (err, data) => {
  if (err) return handleError(err);
  console.log(data);
});
