'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  KnowledgeTest = mongoose.model('KnowledgeTest'),
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
        message = 'Knowledge test already exists';
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
 * Create a Knowledge test
 */
exports.create = function(req, res) {
  var knowledgeTest = new KnowledgeTest(req.body);
  knowledgeTest.user = req.user;

  knowledgeTest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knowledgeTest);
    }
  });
};

/**
 * Show the current Knowledge test
 */
exports.read = function(req, res) {
  res.jsonp(req.knowledgeTest);
};

/**
 * Update a Knowledge test
 */
exports.update = function(req, res) {
  var knowledgeTest = req.knowledgeTest;

  knowledgeTest = _.extend(knowledgeTest, req.body);

  knowledgeTest.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knowledgeTest);
    }
  });
};

/**
 * Delete an Knowledge test
 */
exports.delete = function(req, res) {
  var knowledgeTest = req.knowledgeTest;

  knowledgeTest.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(knowledgeTest);
    }
  });
};

/**
 * List of Knowledge tests
 */
exports.list = function(req, res) {
  KnowledgeTest.find()
    .sort('-start')
    .populate('user', 'displayName')
    .populate('classroom', 'name')
    .populate('question', 'text')
    .exec(function(err, knowledgeTests) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(knowledgeTests);
      }
    });
};

/**
 * Knowledge test middleware
 */
exports.knowledgeTestByID = function(req, res, next, id) {
  KnowledgeTest.findById(id)
    .populate('user', 'displayName')
    .populate('classroom', 'name students')
    .populate('question', 'text answers rightAnswer')
    .exec(function(err, knowledgeTest) {
      if (err) return next(err);
      if (!knowledgeTest) return next(new Error('Failed to load Knowledge test ' + id));
      req.knowledgeTest = knowledgeTest;
      next();
    });
};

/**
 * Knowledge test authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.knowledgeTest.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};