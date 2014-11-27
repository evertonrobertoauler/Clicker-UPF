'use strict';

var _ = require('lodash'),
  parser = require('./parser.user'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  queries = require('./queries'),
  serializeUser = require('./../app/serializer.user'),
  Q = require('q');

var parseUpdate = function(req) {
  return (new parser.Update(req.body)).validate();
};


/**
 * Update user details
 */
exports.update = Q.async(function*(req, res) {

  try {
    var data = yield Q.all([queries.exec(User.findById(req.user._id)), parseUpdate(req)]);

    var user = _.extend(data[0], data[1]);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;
    user = yield queries.exec(user, 'save');
    res.status(202).jsonp(serializeUser(user));
  } catch (e) {
    console.trace(e);
    res.status(400).jsonp(e);
  }
});

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(serializeUser(req.user));
};