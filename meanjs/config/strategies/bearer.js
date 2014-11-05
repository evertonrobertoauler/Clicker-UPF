'use strict';

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('mongoose').model('Token');
var jwt = require('jsonwebtoken');
var config = require('./../config');

module.exports = function() {
  passport.use(new BearerStrategy(function(token, done) {
    jwt.verify(token, config.sessionSecret, function(err, decoded) {
      if (err) {
        done(null, false, err);
      }

      Token.findOne({_id: decoded.id}).populate('user').exec(function(err, token) {
        if (token) {
          token.user.password = undefined;
          token.user.salt = undefined;
          done(null, token.user);
        } else {
          done(null, false, {message: 'Invalid token'});
        }
      });
    });
  }));
};