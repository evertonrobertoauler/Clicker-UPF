'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  passport = require('passport'),
  config = require('./config'),
  path = require('path');

module.exports = function() {
  // Initialize express app
  var app = express();

  // Globbing model files
  config.getGlobbedFiles('./app/model\\.*.js').forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.url = req.protocol + '://' + req.headers.host + req.url;
    next();
  });

  // Cors
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if ('OPTIONS' === req.method) {
      res.send();
    } else {
      next();
    }
  });

  // Showing stack errors
  app.set('showStackError', true);

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Enable jsonp
  app.enable('jsonp callback');

  // CookieParser should be above session
  app.use(cookieParser());

  // use passport session
  app.use(passport.initialize());

  // Globbing routing files
  config.getGlobbedFiles('./app/routes\\.*.js').forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });

  // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
  app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    } else if (err.stack) {
      console.error(err.stack);
    }

    // Error page
    res.status(err.status || 500).jsonp({
      error: err.message || err.stack
    });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).jsonp({
      url: req.originalUrl,
      error: 'Not Found'
    });
  });

  return app;
};