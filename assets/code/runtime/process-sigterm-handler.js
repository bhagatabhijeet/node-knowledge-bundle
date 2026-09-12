process.on('SIGTERM', () => {
  server.close(() => process.exit(0)); // graceful shutdown
});
