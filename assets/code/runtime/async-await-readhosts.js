async function readHosts() {
  try {
    const data = await readFile('/etc/hosts', 'utf8');
    return data;
  } catch (err) {
    handleError(err);
  }
}
