'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var questions = require('../../app/controllers/questions');

  var professor = users.hasAuthorization(['professor']);

	// Questions Routes
	app.route('/questions')
		.get(professor, questions.list)
		.post(professor, questions.create);

	app.route('/questions/:questionId')
		.get(professor, questions.read)
		.put(professor, questions.hasAuthorization, questions.update)
		.delete(professor, questions.hasAuthorization, questions.delete);

	// Finish by binding the Question middleware
	app.param('questionId', questions.questionByID);
};