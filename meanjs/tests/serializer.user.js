'use strict';

var should = require('should');
var serializer = require('./../app/serializer.user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var queries = require('./../app/queries');

/**
 * Unit tests
 */
describe('User Serializer Unit Tests:', function() {

  it('should serialize user', function(done) {
    queries.exec(User.findOne())
      .then(function(user) {
        should.exist(user);
        should.exist(user.password);
        var userSerialized = serializer(user);
        should.exist(userSerialized);
        should.not.exist(userSerialized.password);
        should(userSerialized.displayName).be.equal(user.displayName);
        done();
      })
      .fail(done);
  });
});