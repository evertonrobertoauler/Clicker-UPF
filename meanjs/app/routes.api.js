'use strict';

module.exports = function(app) {

  var token = require('./controller.token');
  var profile = require('./controller.user.profile');
  var auth = require('./controller.user.auth');
  var students = require('./controller.api.students');
  var classrooms = require('./controller.api.classrooms');
  var questions = require('./controller.api.questions');
  var knowledgeTests = require('./controller.api.knowledgeTests');

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
  router.get('/classrooms/:id', classrooms.get);
  router.put('/classrooms/:id', classrooms.update);
  router.delete('/classrooms/:id', classrooms.delete);

  router.get('/questions', questions.list);
  router.post('/questions', questions.insert);
  router.get('/questions/:id', questions.get);
  router.put('/questions/:id', questions.update);
  router.delete('/questions/:id', questions.delete);

  router.get('/knowledge/tests', knowledgeTests.list);
  router.post('/knowledge/tests', knowledgeTests.insert);
  router.get('/knowledge/tests/:id', knowledgeTests.get);
  router.patch('/knowledge/tests/:id', knowledgeTests.update);
  router.delete('/knowledge/tests/:id', knowledgeTests.delete);

  app.use('/api/v1', router);
};