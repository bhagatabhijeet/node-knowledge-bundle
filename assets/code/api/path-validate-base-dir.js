const resolved = path.resolve(baseDir, userInput);
if (!resolved.startsWith(path.resolve(baseDir) + path.sep)) {
  throw new Error('Path traversal attempt blocked');
}
