'use strict';
var express = require('express');
var token = require('./../controllers/token');

module.exports = function(app) {

  var router = express.Router();
  var users = require('../../app/controllers/users');

  router.use(token.middleware);

  router.get('/user', users.me);
  router.put('/user', users.update);
  router.delete('/user/accounts', users.removeOAuthProvider);

  router.get('/test', function(req, res){
    res.jsonp({status: 'OK', user: req.user._id});
  });

  app.use('/api/v1', router);
};