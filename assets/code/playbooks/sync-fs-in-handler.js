app.get('/report', (req, res) => {
  const raw = fs.readFileSync('./huge-report.json'); // blocks the loop
  res.json(JSON.parse(raw));
});
