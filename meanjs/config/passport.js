'use strict';

var path = require('path'),
	config = require('./config');

module.exports = function() {
	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};