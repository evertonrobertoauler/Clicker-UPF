'use strict';

var _ = require('lodash'),
  parser = require('./parser.user'),
  queries = require('./queries');

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
      user.password = undefined;
      user.salt = undefined;
      res.status(202).jsonp(user);
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
  res.jsonp(req.user || null);
};