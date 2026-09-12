let body = '';
req.on('data', (chunk) => (body += chunk));
req.on('end', () => {
  const parsed = JSON.parse(body); // guard with try/catch — see error handling
});
