'use strict';

(function() {
  var amqp = require('amqp');

  var connection = amqp.createConnection({
    url: 'amqp://guest:guest@localhost:5672'
  });

  connection.on('ready', function() {
    connection.queue('my-queue', function(q) {
      q.bind('#');
      q.subscribe(function(message) {
        console.log(message.data.toString('utf8'));
      });
    });
  });

  connection.on('error', function(a, b, c) {
    console.log(a, b, c);
  });

  var io = require('socket.io')(3001);

  io.on('connection', function(socket) {

    io.emit('this', { will: 'be received by everyone'});

    socket.on('private message', function(from, msg) {
      console.log('I received a private message by ', from, ' saying ', msg);
    });

    socket.on('disconnect', function() {
      console.log('disconnect');
      io.sockets.emit('user disconnected');
    });
  });
})();