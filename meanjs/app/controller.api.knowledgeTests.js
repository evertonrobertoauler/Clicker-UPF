'use strict';

(function() {

  var queries = require('./queries');
  var parser = require('./parser.knowledgeTest');
  var mongoose = require('mongoose');
  var KnowledgeTest = mongoose.model('KnowledgeTest');
  var Classroom = mongoose.model('Classroom');
  var Question = mongoose.model('Question');
  var Q = require('q');
  var _ = require('lodash');

  var parseInsert = function(req) {
    return (new parser.Insert(req.body)).validate();
  };

  var parseUpdate = function(req) {
    return (new parser.Update(req.body)).validate();
  };

  var getKnowledgeTest = function(req) {
    return queries.exec(KnowledgeTest.findOne({
      _id: req.params.id,
      'professor._id': req.user._id
    }));
  };

  var getClassroom = function(knowledgeTest) {
    return queries.exec(Classroom.findOne({_id: knowledgeTest.classroom}));
  };

  var getQuestion = function(knowledgeTest) {
    return queries.exec(Question.findOne({_id: knowledgeTest.question}));
  };

  exports.list = function(req, res) {

    var filter = queries.filter(req.query);
    filter.where = {'professor._id': req.user._id};

    queries.findList(KnowledgeTest, filter)
      .then(function(data) {
        res.jsonp({length: data[0], list: data[1]});
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.insert = function(req, res) {

    parseInsert(req)
      .then(function(data) {
        return Q.all([data, getClassroom(data), getQuestion(data)]);
      })
      .then(function(data) {
        var knowledgeTest = new KnowledgeTest(data[0]);
        knowledgeTest.professor = req.user;
        knowledgeTest.classroom = data[1];
        knowledgeTest.question = data[2];
        return queries.exec(knowledgeTest, 'save');
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
    getKnowledgeTest(req)
      .then(function(data) {
        res.jsonp(data);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.update = function(req, res) {
    Q.all([getKnowledgeTest(req), parseUpdate(req)])
      .then(function(data) {
        var knowledgeTest = _.extend(data[0], data[1]);
        return queries.exec(knowledgeTest, 'save');
      })
      .then(function(knowledgeTest) {
        res.status(202).jsonp(knowledgeTest);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.delete = function(req, res) {
    getKnowledgeTest(req)
      .then(function(knowledgeTest) {
        return queries.exec(knowledgeTest, 'remove');
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