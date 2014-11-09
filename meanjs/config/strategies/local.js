'use strict';

module.exports = function() {
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var User = require('mongoose').model('User');

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user or invalid password'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Unknown user or invalid password'
          });
        }

        return done(null, user);
      });
    }
  ));
};