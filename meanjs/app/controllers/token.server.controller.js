'use strict';

var passport = require('passport');
var jwt = require('jsonwebtoken');
var Token = require('./../models/token.server.model');
var config = require('./../../config/config');

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

exports.create = function (user, done) {
  var token = new Token({user: user});

  token.save(function() {
    token.accessToken = jwt.sign(
      {id: token._id}, config.sessionSecret, {expiresInMinutes: 60 * 5}
    );
    token.refreshToken = jwt.sign(
      {id: token._id, accessToken: token.accessToken}, config.sessionSecret
    );
    token.save(function() {
      user.token = {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      };
      done();
    });
  });
};

exports.createTemporary = function(user, done) {
  var token = new Token({user: user});

  token.save(function() {
    token.refreshToken = jwt.sign(
      {id: token._id}, config.sessionSecret, {expiresInMinutes: 1}
    );
    token.save(function() {
      user.token = {refreshToken: token.refreshToken};
      done();
    });
  });
};

exports.refreshToken = function(req, res) {
  jwt.verify(req.body.refreshToken, config.sessionSecret, function(err, decoded) {
    if (err) {
      res.status(400).jsonp(err);
    }

    Token.findOne({
      _id: decoded.id,
      expiration: {$gt: new Date()}
    }).populate('user')
      .exec(function(err, token) {
        if (err || !token) {
          res.status(400).jsonp(err || {message: 'Invalid token!'});
        } else {
          token.remove(function() {
            exports.create(token.user, function() {
              res.jsonp(token.user.token);
            });
          });
        }
      });
  });
};
