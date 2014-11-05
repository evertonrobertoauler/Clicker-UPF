'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Token = mongoose.model('Token');

/**
 * Globals
 */
var user, tokens;

/**
 * Unit tests
 */
describe('Token Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			password: 'password'
		});

		user.save(function() {
      tokens = [];

      for (var i = 0; i < 4; i++) {
        tokens.push(new Token({
          user: user,
          accessToken: 'accessToken',
          refreshToken: 'refreshToken'
        }));
      }

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return tokens[0].save(function(err) {
				should.not.exist(err);
				done();
			});
		});

    it('should save 4 tokens and should remain just 3 tokens', function(done){
      tokens[2].expiration = new Date();

      tokens[0].save(function(){
        tokens[1].save(function(){
          tokens[2].save(function(){
            tokens[3].save(function(){
              Token.count(function(err, count){
                should(count).be.exactly(3);
                done();
              });
            });
          });
        });
      });
    });
	});

	afterEach(function(done) { 
		Token.remove().exec();
		User.remove().exec();

		done();
	});
});