'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var knoledgeTests = require('../../app/controllers/knoledge-tests');

	// Knoledge tests Routes
	app.route('/knoledge-tests')
		.get(knoledgeTests.list)
		.post(users.requiresLogin, knoledgeTests.create);

	app.route('/knoledge-tests/:knoledgeTestId')
		.get(knoledgeTests.read)
		.put(users.requiresLogin, knoledgeTests.hasAuthorization, knoledgeTests.update)
		.delete(users.requiresLogin, knoledgeTests.hasAuthorization, knoledgeTests.delete);

	// Finish by binding the Knoledge test middleware
	app.param('knoledgeTestId', knoledgeTests.knoledgeTestByID);
};