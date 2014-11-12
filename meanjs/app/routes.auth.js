'use strict';

module.exports = function(app) {

  var passport = require('passport');
	var auth = require('../controllers/user/auth');
  var token = require('../../app/controllers/token');

	// Setting up the users authentication api
	app.route('/auth/signup').post(auth.signup);
	app.route('/auth/signin').post(auth.signin);

  app.route('/auth/token').post(token.refreshToken);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(auth.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(auth.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(auth.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(auth.oauthCallback('linkedin'));
	
	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(auth.oauthCallback('github'));
};
