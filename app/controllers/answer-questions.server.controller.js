'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  _ = require('lodash');

/**
 * Answer a Question
 */
exports.update = function(req, res) {

};

/**
 * List of Questions
 */
exports.list = function(req, res) {

};

exports.canAnswer = function(req, res, next) {
  if (req.knowledgeTest.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};