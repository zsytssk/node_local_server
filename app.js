let server = require('./server');
let app = require('http').createServer(server);
let primus = require('./primus');
let test = require('./test');
let port = 4000;

primus(app);

app.listen(port);
console.log(`run socket in ${port} port!`);