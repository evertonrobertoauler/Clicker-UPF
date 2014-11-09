'use strict';

(function() {

  require('./config/init')();

  var config = require('./config/config');
  var mongoose = require('mongoose');
  var jwt = require('jsonwebtoken');

  // Bootstrap db connection
  mongoose.connect(config.db, function(err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  });

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
    jwt.verify(socket.request._query.token, config.sessionSecret, function(err, decoded) {
      if (err) {
        socket.disconnect();
      } else {
        console.log(decoded);

        io.emit('this', { will: 'be received by everyone'});

        socket.on('private message', function(from, msg) {
          console.log('I received a private message by ', from, ' saying ', msg);
        });

        socket.on('disconnect', function() {
          console.log('disconnect');
          io.sockets.emit('user disconnected');
        });
      }
    });
  });
})();