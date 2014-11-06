'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  token = require('./../token'),
  config = require('./../../../config/config');

/**
 * Signup
 */
exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;
  delete req.body.password2;

  // Init Variables
  var user = new User(req.body);

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      user = user.toObject();

      token.create(user, function(newToken) {
        res.jsonp({user: user, token: newToken});
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      user = user.toObject();

      token.create(user, function(newToken) {
        res.jsonp({user: user, token: newToken});
      });
    }
  })(req, res, next);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user) {
      if (err || !user) {
        return res.redirect(config.url + '/#/signin');
      }

      token.createTemporary(user, function(refreshToken) {
        return res.redirect(config.url + '/#/token/' + refreshToken);
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {

  User.findOne({email: providerUserProfile.email}, function(err, user) {
    if (!user) {
      // Define a search query fields
      var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
      var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

      // Define main provider search query
      var mainProviderSearchQuery = {};
      mainProviderSearchQuery.provider = providerUserProfile.provider;
      mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

      // Define additional provider search query
      var additionalProviderSearchQuery = {};
      additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

      // Define a search query to find existing user with current provider profile
      var searchQuery = {
        $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
      };

      User.findOne(searchQuery, function(err, user) {
        if (err) {
          return done(err);
        } else {
          if (!user) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function(err) {
              return done(err, user);
            });
          } else {
            return done(err, user);
          }
        }
      });
    } else {
      // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
      if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
        // Add the provider data to the additional provider data field
        if (!user.additionalProvidersData) {
          user.additionalProvidersData = {};
        }
        user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');

        // And save the user
        user.save(function(err) {
          return done(err, user, '/#/settings/accounts');
        });
      } else {
        return done(null, user);
      }
    }
  });

};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res) {
  var user = req.user;
  var provider = req.param('provider');

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');
    }

    user.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(user);
      }
    });
  }
};