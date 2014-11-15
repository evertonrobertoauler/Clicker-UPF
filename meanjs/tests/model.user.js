'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  queries = require('./../app/queries');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
  before(function(done) {
    var data = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      password: 'password',
      provider: 'local'
    };

    user = new User(data);
    user2 = new User(data);

    done();
  });

  describe('Method Save', function() {
    it('should begin with 5 users', function(done) {
      queries.exec(User.find({}).lean())
        .then(function(users) {
          (users.length).should.be.equal(5);
          done();
        })
        .fail(done);
    });

    it('should be able to save without problems', function(done) {
      user.save(done);
    });

    it('should fail to save an existing user again', function(done) {
      user.save();
      return user2.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without first name', function(done) {
      user.firstName = '';
      return user.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });
});