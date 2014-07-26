'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  KnoledgeTest = mongoose.model('KnoledgeTest'),
  _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Knoledge test already exists';
        break;
      default:
        message = 'Erro desconhecido';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * Create a Knoledge test
 */
exports.create = function(req, res) {
  var knoledgeTest = new KnoledgeTest(req.body);
  knoledgeTest.user = req.user;

  knoledgeTest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knoledgeTest);
    }
  });
};

/**
 * Show the current Knoledge test
 */
exports.read = function(req, res) {
  res.jsonp(req.knoledgeTest);
};

/**
 * Update a Knoledge test
 */
exports.update = function(req, res) {
  var knoledgeTest = req.knoledgeTest;

  knoledgeTest = _.extend(knoledgeTest, req.body);

  knoledgeTest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knoledgeTest);
    }
  });
};

/**
 * Delete an Knoledge test
 */
exports.delete = function(req, res) {
  var knoledgeTest = req.knoledgeTest;

  knoledgeTest.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knoledgeTest);
    }
  });
};

/**
 * List of Knoledge tests
 */
exports.list = function(req, res) {
  KnoledgeTest.find()
    .sort('-start')
    .populate('user', 'displayName')
    .exec(function(err, knoledgeTests) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(knoledgeTests);
      }
    });
};

/**
 * Knoledge test middleware
 */
exports.knoledgeTestByID = function(req, res, next, id) {
  KnoledgeTest.findById(id)
    .populate('user', 'displayName')
    .exec(function(err, knoledgeTest) {
      if (err) return next(err);
      if (!knoledgeTest) return next(new Error('Failed to load Knoledge test ' + id));
      req.knoledgeTest = knoledgeTest;
      next();
    });
};

/**
 * Knoledge test authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.knoledgeTest.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};