let primus = Primus.connect('http://localhost/', {
  reconnect: {
    max: Infinity, // Number: The max delay before we try to reconnect.
    min: 500, // Number: The minimum delay before we try reconnect.
    retries: 10 // Number: How many times we should try to reconnect.
  }
});

primus.on('open', function open() {
  primus.write('message');
  console.log('Connection is alive and kicking');
});
primus.on('data', function message(data) {
  console.log('Received a new message from the server', data);
});
primus.on('error', function error(err) {
  console.error('Something horrible has happened', err.stack);
});
primus.on('reconnect', function (opts) {
  console.log('Reconnection attempt started');
});
primus.on('end', function () {
  console.log('Connection closed');
});
primus.emits('data', function parser(next, structure) {
  next(undefined, structure.data);
  console.log(structure);
});