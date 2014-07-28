'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var knowledgeTests = require('../../app/controllers/knowledge-tests');

  var professor = users.hasAuthorization(['professor']);

	// Knowledge tests Routes
	app.route('/knowledge-tests')
		.get(knowledgeTests.list)
		.post(professor, knowledgeTests.create);

	app.route('/knowledge-tests/:knowledgeTestId')
		.get(knowledgeTests.read)
		.put(professor, knowledgeTests.hasAuthorization, knowledgeTests.update)
		.delete(professor, knowledgeTests.hasAuthorization, knowledgeTests.delete);

	// Finish by binding the Knowledge test middleware
	app.param('knowledgeTestId', knowledgeTests.knowledgeTestByID);
};