let Primus = require('primus');
let sendData = require('./primus/sendData.js');

module.exports = function (app) {
  primus = new Primus(app, {
    pingInterval: 1000
  });
  primus.on('connection', function (spark) {
    spark.on('data', function (data) {
      sendData(data, spark, primus);
    });
  });
  primus.on('disconnection', function (spark) {
    // the spark that disconnected
  });
  primus.on('disconnection', function (spark) {
    // the spark that disconnected
  });

};

function encode(data) {
  return JSON.stringify(data);
}