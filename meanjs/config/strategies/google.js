'use strict';

module.exports = function() {

  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var config = require('../config');
  var auth = require('../../app/controller.user.auth');

  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};