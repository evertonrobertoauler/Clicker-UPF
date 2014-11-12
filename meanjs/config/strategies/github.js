'use strict';

module.exports = function() {

  var passport = require('passport');
  var GithubStrategy = require('passport-github').Strategy;
  var config = require('../config');
  var auth = require('../../app/controller.user.auth');

  passport.use(new GithubStrategy({
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      callbackURL: config.github.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
        provider: 'github',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};