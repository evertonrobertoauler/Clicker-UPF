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
  var api = express.Router();
  var student = express.Router();
  var professor = express.Router();

  api.use(token.middleware);

  api.use(function(req, res, next) {
    if (req.query.q) {
      req.query = JSON.parse(req.query.q);
    }

    next();
  });

  student.use(function(req, res, next) {
    if (req.user.roles.indexOf('student') === -1) {
      res.status(403).send();
    } else {
      next();
    }
  });

  professor.use(function(req, res, next) {
    if (req.user.roles.indexOf('professor') === -1) {
      res.status(403).send();
    } else {
      next();
    }
  });

  api.get('/user', profile.me);
  api.put('/user', profile.update);
  api.delete('/user/accounts', auth.removeOAuthProvider);

  student.get('/knowledge/tests', knowledgeTests.studentList);
  student.patch('/knowledge/tests/:id', knowledgeTests.studentAnswer);

  professor.get('/students', students.list);

  professor.get('/classrooms', classrooms.list);
  professor.post('/classrooms', classrooms.insert);
  professor.get('/classrooms/:id', classrooms.get);
  professor.put('/classrooms/:id', classrooms.update);
  professor.delete('/classrooms/:id', classrooms.delete);

  professor.get('/questions', questions.list);
  professor.post('/questions', questions.insert);
  professor.get('/questions/:id', questions.get);
  professor.put('/questions/:id', questions.update);
  professor.delete('/questions/:id', questions.delete);

  professor.get('/knowledge/tests', knowledgeTests.list);
  professor.post('/knowledge/tests', knowledgeTests.insert);
  professor.get('/knowledge/tests/:id', knowledgeTests.get);
  professor.patch('/knowledge/tests/:id', knowledgeTests.update);
  professor.delete('/knowledge/tests/:id', knowledgeTests.delete);

  api.use('/student', student);
  api.use('/professor', professor);
  app.use('/api/v1', api);
};