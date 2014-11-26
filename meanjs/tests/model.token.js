'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Token = mongoose.model('Token'),
  queries = require('./../app/queries'),
  Q = require('q');

var token;

describe('Token Model Unit Tests:', function() {
  before(Q.async(function*() {
    var user = yield queries.exec(User.findOne({email: 'student1@test.com'}));

    token = new Token({
      user: user,
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      expiration: new Date(),
    });
  }));

  it('should be able to save without problems', function() {
    return queries.exec(token, 'save');
  });

  it('should be able to remove without problems', function() {
    return queries.exec(token, 'remove');
  });
});