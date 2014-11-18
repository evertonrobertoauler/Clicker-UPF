'use strict';

(function() {

  require('./config/init')();

  var config = require('./config/config');
  //var mongoose = require('mongoose');
  var jwt = require('jsonwebtoken');
  var rabbit = require('rabbit.js');
  var _ = require('lodash');

  require('./config/init')();
  require('./config/mongodb')(config);

  var messages = require('./app/messages');

  var users = {};

  var io = require('socket.io')(3001);

  io.on('connection', function(socket) {
    jwt.verify(socket.request._query.token, config.sessionSecret, function(err, decoded) {
      if (err) {
        socket.disconnect();
      } else if (users[decoded.user]) {
        users[decoded.user].push(socket);
      } else {

        var userId = decoded.user;

        messages.send(userId, 'this', {hello: 'world'});

        console.log(userId, 'connected');

        messages.recv(userId, function(name, data) {
          console.log(name, data);
          io.emit(name, data);
        });

        socket.on('disconnect', function() {
          console.log(userId, 'disconnected');
          _.pull(users[userId], socket);

          if (!users[userId] || !users[userId].length) {
            delete users[userId];
            messages.stop(userId);
          }
        });
      }
    });
  });

  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    setTimeout(function(){
      messages.reconnect();
    }, 5000);
  });
})();