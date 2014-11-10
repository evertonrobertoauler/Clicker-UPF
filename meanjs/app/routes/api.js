'use strict';

module.exports = function(app) {

  var token = require('./../controllers/token');
  var profile = require('../../app/controllers/user/profile');
  var auth = require('../controllers/user/auth');
  var students = require('./../controllers/api/students');
  var classrooms = require('./../controllers/api/classrooms');
  var questions = require('./../controllers/api/questions');
  var knowledgeTests = require('./../controllers/api/knowledgeTests');

  var express = require('express');
  var router = express.Router();

  router.use(token.middleware);

  router.use(function(req, res, next){
    if (req.query.q) {
      req.query = JSON.parse(req.query.q);
    }

    next();
  });

  router.get('/user', profile.me);
  router.put('/user', profile.update);
  router.delete('/user/accounts', auth.removeOAuthProvider);

  router.get('/test', function(req, res){
    res.jsonp({status: 'OK', user: req.user._id});
  });

  router.get('/students', students.list);

  router.get('/classrooms', classrooms.list);
  router.post('/classrooms', classrooms.insert);
  router.patch('/classrooms/:id', classrooms.update);
  router.delete('/classrooms/:id', classrooms.delete);

  router.get('/questions', questions.list);
  router.post('/questions', questions.insert);
  router.get('/questions/:id', questions.get);
  router.put('/questions/:id', questions.update);
  router.delete('/questions/:id', questions.delete);

  router.get('/knowledge/tests', knowledgeTests.list);
  router.post('/knowledge/tests', knowledgeTests.insert);
  router.patch('/knowledge/tests/:id', knowledgeTests.update);
  router.delete('/knowledge/tests/:id', knowledgeTests.delete);

  app.use('/api/v1', router);
};