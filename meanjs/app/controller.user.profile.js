'use strict';

var _ = require('lodash'),
  parser = require('./parser.user'),
  queries = require('./queries'),
  serializeUser = require('./../app/serializer.user');

var parseUpdate = function(req) {
  return (new parser.Update(req.body)).validate();
};


/**
 * Update user details
 */
exports.update = function(req, res) {
  parseUpdate(req)
    .then(function(data) {
      var user = _.extend(req.user, data);
      user.updated = Date.now();
      user.displayName = user.firstName + ' ' + user.lastName;
      return queries.exec(user, 'save');
    })
    .then(function(user) {
      res.status(202).jsonp(serializeUser(user));
    })
    .fail(function(err) {
      console.trace(err);
      res.status(400).jsonp(err);
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(serializeUser(req.user));
};