process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1); // do not resume normal operation
});

process.on('unhandledRejection', (reason) => {
  logger.fatal(reason);
  process.exit(1);
});
