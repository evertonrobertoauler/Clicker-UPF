'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	KnoledgeTest = mongoose.model('KnoledgeTest');

/**
 * Globals
 */
var user, knoledgeTest;

/**
 * Unit tests
 */
describe('Knoledge test Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			knoledgeTest = new KnoledgeTest({
				name: 'Knoledge test Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return knoledgeTest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			knoledgeTest.name = '';

			return knoledgeTest.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		KnoledgeTest.remove().exec();
		User.remove().exec();

		done();
	});
});