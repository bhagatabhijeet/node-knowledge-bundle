process.exitCode = 1;  // preferred: lets pending I/O and 'exit' listeners run
process.exit(1);       // immediate: terminates now, may cut off pending async work
