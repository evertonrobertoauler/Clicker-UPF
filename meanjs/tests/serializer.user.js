'use strict';

var should = require('should');
var serializer = require('./../app/serializer.user');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var queries = require('./../app/queries');
var Q = require('q');

/**
 * Unit tests
 */
describe('User Serializer Unit Tests:', function() {

  it('should serialize user', Q.async(function*() {
    var user = yield queries.exec(User.findOne());

    should.exist(user);
    should.exist(user.password);

    var userSerialized = serializer(user);

    should.exist(userSerialized);
    should.not.exist(userSerialized.password);
    should(userSerialized.displayName).be.equal(user.displayName);
  }));
});