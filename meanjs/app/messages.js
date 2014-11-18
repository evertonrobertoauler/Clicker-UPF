'use strict';

var rabbit = require('rabbit.js');
var config = require('./../config/config');
var Q = require('q');
var context = new rabbit.createContext(config.rabbitMQ);

var WORKERS = {};

var getWorker = function(userId) {
  if (WORKERS[userId]) {
    return Q.when(WORKERS[userId]);
  } else {
    WORKERS[userId] = Q.Promise(function(resolve) {
      var worker = context.socket('WORKER', {prefetch: 1});
      worker.connect(userId, function() {
        WORKERS[userId] = worker;
        resolve(worker);
      });
    });

    return WORKERS[userId];
  }
};

exports.send = function(userId, name, data) {
  return Q.Promise(function(resolve) {
    var push = context.socket('PUSH');
    push.connect(userId, function() {
      var msg = {name: name, data: data};
      push.write(JSON.stringify(msg), 'utf8');
      push.close();
      resolve();
    });
  });
};

exports.recv = function(userId, callback) {
  getWorker(userId).then(function(worker) {
    worker.on('readable', function() {
      var msg = JSON.parse(worker.read());
      callback(msg.name, msg.data);
      worker.ack();
    });
  });
};

exports.stop = function(userId) {
  if (WORKERS[userId]) {
    Q.when(WORKERS[userId]).then(function(worker) {
      worker.close();
      delete WORKERS[userId];
    });
  }
};

exports.reconnect = function() {
  WORKERS = {};
  context = new rabbit.createContext(config.rabbitMQ);
};