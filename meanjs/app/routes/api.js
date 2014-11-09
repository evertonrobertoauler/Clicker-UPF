'use strict';

module.exports = function(app) {

  var token = require('./../controllers/token');
  var profile = require('../../app/controllers/user/profile');
  var auth = require('../controllers/user/auth');
  var knowledgeTests = require('./../controllers/api/knowledgeTests');

  var express = require('express');
  var router = express.Router();

  router.use(token.middleware);

  router.get('/user', profile.me);
  router.put('/user', profile.update);
  router.delete('/user/accounts', auth.removeOAuthProvider);

  router.get('/test', function(req, res){
    res.jsonp({status: 'OK', user: req.user._id});
  });

  router.get('/knowledge/tests', knowledgeTests.list);

  app.use('/api/v1', router);
};