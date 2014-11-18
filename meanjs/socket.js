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

  var USERS = {};

  var io = require('socket.io')(3001);

  io.on('connection', function(socket) {
    jwt.verify(socket.request._query.token, config.sessionSecret, function(err, decoded) {
      if (err) {
        socket.disconnect();
      } else {
        var userId = decoded.user;
        console.log(decoded.user, 'connected');
        messages.send(userId, 'this', {hello: 'world'});

        if (USERS[userId]) {
          USERS[userId].push(socket);
        } else {

          USERS[userId] = [socket];

          messages.recv(userId, function(name, data) {
            USERS[userId].forEach(function(s) {
              console.log(name, data);
              s.emit(name, data);
            });
          });
        }

        socket.on('disconnect', function() {
          console.log(userId, 'disconnected');
          console.log(USERS[userId].length);

          _.pull(USERS[userId], socket);

          console.log(USERS[userId].length);

          if (!USERS[userId] || !USERS[userId].length) {
            delete USERS[userId];
            messages.stop(userId);
          }
        });
      }
    });
  });

  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    setTimeout(function() {
      messages.reconnect();
    }, 15000);
  });
})();