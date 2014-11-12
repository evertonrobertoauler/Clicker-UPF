'use strict';

module.exports = function() {

  var passport = require('passport');
  var TwitterStrategy = require('passport-twitter').Strategy;
  var config = require('../config');
  var auth = require('../../app/controller.user.auth');

	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
      auth.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};