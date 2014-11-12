'use strict';

module.exports = function() {

  var passport = require('passport');
  var LinkedInStrategy = require('passport-linkedin').Strategy;
  var config = require('../config');
  var auth = require('../../app/controller.user.auth');

  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: config.linkedin.clientSecret,
      callbackURL: config.linkedin.callbackURL,
      passReqToCallback: true,
      profileFields: ['id', 'first-name', 'last-name', 'email-address']
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
        provider: 'linkedin',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};