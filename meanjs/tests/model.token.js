'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  queries = require('./../app/queries');

var token;

describe('Token Model Unit Tests:', function() {
  before(function(done) {
    queries.exec(User.findOne({email: 'student1@test.com'}))
      .then(function(user) {
        token = new Token({
          user: user,
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
          expiration: new Date(),
        });
        done();
      })
      .fail(done);
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return token.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  describe('Method Remove', function() {
    it('should be able to remove without problems', function(done) {
      return token.remove(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });
});