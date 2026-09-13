const { Transform } = require('node:stream');

const toUpperCaseName = new Transform({
  objectMode: true,
  transform(record, _enc, callback) {
    callback(null, { ...record, name: record.name.toUpperCase() });
  },
});
