fs.createReadStream('huge.log')
  .pipe(fs.createWriteStream('huge.log.copy'));
