'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var answerQuestions = require('../../app/controllers/answer-questions');

  // Questions Routes
  app.route('/answer/questions')
    .get(users.requiresLogin, answerQuestions.list);

  app.route('/answer/questions/:testId')
    .put(users.requiresLogin, answerQuestions.update);
};