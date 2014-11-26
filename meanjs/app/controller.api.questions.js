'use strict';

(function() {

  var queries = require('./queries');
  var SaveParser = require('./parser.question').Save;
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

  exports.insert = Q.async(function*(req, res) {
    try {
      var body = yield parseQuestion(req);
      var question = new Question(body);
      question.professor = req.user;
      question = yield queries.exec(question, 'save');
      res.status(201).jsonp(question);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.get = Q.async(function*(req, res) {
    try {
      var question = yield getQuestion(req);
      res.jsonp(question);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.update = Q.async(function*(req, res) {
    try {
      var data = yield Q.all([getQuestion(req), parseQuestion(req)]);
      var question = _.extend(data[0], data[1]);
      question = yield queries.exec(question, 'save');
      res.status(202).jsonp(question);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.delete = Q.async(function*(req, res) {
    try {
      var question = yield getQuestion(req);
      yield queries.exec(question, 'remove');
      res.status(204).send();
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });
})();