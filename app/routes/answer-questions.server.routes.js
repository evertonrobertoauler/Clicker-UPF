'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var questions = require('../../app/controllers/questions');
  var answerQuestions = require('../../app/controllers/answer-questions');

  // Questions Routes
  app.route('/answer/questions')
    .get(users.requiresLogin, answerQuestions.list);

  app.route('/answer/questions/:questionId')
    .put(users.requiresLogin, answerQuestions.canAnswer, answerQuestions.update);

  // Finish by binding the Question middleware
  app.param('questionId', questions.questionByID);
};