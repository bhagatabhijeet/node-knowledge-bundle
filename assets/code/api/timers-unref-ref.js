const timer = setInterval(fn, 1000);
timer.unref(); // don't let this timer alone keep the process alive
timer.ref();   // undo unref()
