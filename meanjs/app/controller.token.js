'use strict';

var passport = require('passport');
var jwt = require('jsonwebtoken');
var Token = require('./model.token');
var config = require('./../config/config');
var queries = require('./queries');
var Q = require('q');
var serializeUser = require('./../app/serializer.user');

var createHash = function(obj, options) {
  return jwt.sign(obj, config.sessionSecret, options);
};

exports.middleware = function(req, res, next) {
  passport.authenticate('bearer', function(err, user, info) {
    if (err || !user) {
      res.status(401).jsonp(err || {message: info});
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

exports.create = function(user) {
  var token = new Token({user: user});

  return queries.exec(token, 'save').then(function() {
    token.accessToken = createHash({id: token._id, user: user._id}, {expiresInMinutes: 60 * 5});
    token.refreshToken = createHash({id: token._id, accessToken: token.accessToken});
    return queries.exec(token, 'save');
  });
};

exports.createTemporary = function(user) {
  var token = new Token({user: user});

  return queries.exec(token, 'save').then(function() {
    token.refreshToken = createHash({id: token._id}, {expiresInMinutes: 1});
    return queries.exec(token, 'save');
  });
};

exports.refreshToken = function(req, res) {
  jwt.verify(req.body.refreshToken, config.sessionSecret, function(err, decoded) {
    if (err) {
      return res.status(400).jsonp(err);
    }

    var filter = {_id: decoded.id, expiration: {$gt: new Date()}};

    queries.exec(Token.findOne(filter).populate('user'))
      .then(function(token) {
        return Q.all([serializeUser(token.user), exports.create(token.user), queries.exec(token, 'remove')]);
      })
      .then(function(data) {
        res.jsonp({user: data[0], token: data[1]});
      })
      .fail(function() {
        res.status(400).jsonp({error: 'Invalid token!'});
      });
  });
};
