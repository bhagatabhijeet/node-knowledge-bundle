// Leak: a new listener piles up on every request, none ever removed
function handleRequest(req) {
  longLivedEmitter.on('data', (chunk) => req.socket.write(chunk));
}
