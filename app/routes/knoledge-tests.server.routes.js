'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var knoledgeTests = require('../../app/controllers/knoledge-tests');

  var professor = users.hasAuthorization(['professor']);

	// Knoledge tests Routes
	app.route('/knoledge-tests')
		.get(knoledgeTests.list)
		.post(professor, knoledgeTests.create);

	app.route('/knoledge-tests/:knoledgeTestId')
		.get(knoledgeTests.read)
		.put(professor, knoledgeTests.hasAuthorization, knoledgeTests.update)
		.delete(professor, knoledgeTests.hasAuthorization, knoledgeTests.delete);

	// Finish by binding the Knoledge test middleware
	app.param('knoledgeTestId', knoledgeTests.knoledgeTestByID);
};