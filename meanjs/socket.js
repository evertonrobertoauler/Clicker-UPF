'use strict';

(function() {

  require('./config/init')();

  var config = require('./config/config');
  var jwt = require('jsonwebtoken');
  var rabbit = require('rabbit.js');
  var _ = require('lodash');
  var Q = require('q');

  require('./config/init')();
  require('./config/mongodb')(config);

  var messages = require('./app/messages');

  var USERS = {};

  var auth = function(token) {
    return Q.promise(function(resolve, reject) {
      jwt.verify(token, config.sessionSecret, function(err, decoded) {
        if (err) {
          reject(err);
        } else {
          resolve(decoded.user);
        }
      });
    });
  };

  var connect = function(socket, user) {
    console.log(user, 'connected');
    messages.send(user, 'this', {hello: 'world'});

    if (USERS[user]) {
      USERS[user].push(socket);
    } else {
      USERS[user] = [socket];
      messages.recv(user, function(name, data) {
        USERS[user].forEach(function(s) {
          console.log(name, data);
          s.emit(name, data);
        });
      });
    }
  };

  var disconnect = function(user) {
    return function() {
      console.log(user, 'disconnected');

      _.pull(USERS[user], this);

      if (!USERS[user] || !USERS[user].length) {
        delete USERS[user];
        messages.stop(user);
      }
    };
  };

  var io = require('socket.io')(3001);

  io.on('connection', function(socket) {
    auth(socket.request._query.token)
      .then(function(user) {
        connect(socket, user);
        socket.on('disconnect', disconnect(user));
      })
      .fail(function(err) {
        console.error(err);
        socket.disconnect();
      });
  });

  process.on('uncaughtException', function(err) {
    console.log('Caught exception:', err);
    setTimeout(function() {
      messages.reconnect();
    }, 15000);
  });
})();