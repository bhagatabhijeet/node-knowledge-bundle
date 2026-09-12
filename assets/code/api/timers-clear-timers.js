const id = setTimeout(fn, 1000);
clearTimeout(id);

const intervalId = setInterval(fn, 1000);
clearInterval(intervalId);
