'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  queries = require('./../app/queries'),
  Q = require('q');

var user, user2;

describe('User Model Unit Tests:', function() {
  before(function() {
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
  });

  describe('Method Save', function() {
    it('should begin with 5 users', Q.async(function*() {
      var users = yield queries.exec(User.find().lean());
      (users.length).should.be.equal(5);
    }));

    it('should be able to save without problems', function() {
      return queries.exec(user, 'save');
    });

    it('should fail to save an existing user again', Q.async(function*() {
      should(yield queries.exec(user, 'save')).throw();
    }));

    it('should be able to show an error when try to save without first name', function() {
      user.firstName = '';
      should(queries.exec(user, 'save')).throw();
    });
  });
});