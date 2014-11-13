'use strict';

(function() {

  var queries = require('./queries');
  var SaveParser = require('./parsers.question').Save;
  var Question = require('mongoose').model('Question');
  var Q = require('q');
  var _ = require('lodash');

  var parseQuestion = function(req) {
    return (new SaveParser(req.body)).validate();
  };

  var getQuestion = function(req) {
    return queries.exec(Question.findOne({
      _id: req.params.id,
      'professor._id': req.user._id
    }));
  };

  exports.list = function(req, res) {

    var filter = queries.filter(req.query);
    filter.where = _.merge(req.query.where || {}, {'professor._id': req.user._id});

    queries.findList(Question, filter)
      .then(function(data) {
        res.jsonp({length: data[0], list: data[1]});
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.insert = function(req, res) {
    parseQuestion(req)
      .then(function(data) {
        var question = new Question(data);
        question.professor = req.user;
        return queries.exec(question, 'save');
      })
      .then(function(data) {
        res.status(201).jsonp(data);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.get = function(req, res) {
    getQuestion(req)
      .then(function(data) {
        res.jsonp(data);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.update = function(req, res) {
    Q.all([getQuestion(req), parseQuestion(req)])
      .then(function(data) {
        var question = _.extend(data[0], data[1].toObject());
        return queries.exec(question, 'save');
      })
      .then(function(question) {
        res.status(202).jsonp(question);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.delete = function(req, res) {
    getQuestion(req)
      .then(function(question) {
        return queries.exec(question, 'remove');
      })
      .then(function() {
        return res.status(204).send();
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };
})();