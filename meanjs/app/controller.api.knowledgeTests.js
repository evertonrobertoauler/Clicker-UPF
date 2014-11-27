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
  var task = require('./tasks');

  var scheduleTasks = function(kt) {
    task.schedule('updateKnowledgeTestNumber', [kt.start, kt.professor._id, kt.classroom._id]);
    task.schedule('openKnowledgeTest', [kt._id], kt.start);
    task.schedule('closeKnowledgeTest', [kt._id], kt.end);
  };

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

  exports.list = Q.async(function*(req, res) {
    try {
      var filter = queries.filter(req.query);
      filter.where = _.merge(req.query.where || {}, {'professor._id': req.user._id});

      var data = yield queries.findList(KnowledgeTest, filter);
      res.jsonp({length: data[0], list: data[1]});
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.insert = Q.async(function*(req, res) {
    try {
      var body = yield parseInsert(req);
      var data = yield Q.all([getClassroom(body), getQuestion(body)]);

      var knowledgeTest = new KnowledgeTest(body);
      knowledgeTest.professor = req.user;
      knowledgeTest.classroom = data[0];
      knowledgeTest.question = data[1];
      knowledgeTest = yield queries.exec(knowledgeTest, 'save');
      scheduleTasks(knowledgeTest);
      res.status(201).jsonp(knowledgeTest);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.get = Q.async(function*(req, res) {
    try {
      var knowledgeTest = yield getKnowledgeTest(req);
      res.jsonp(knowledgeTest);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.update = Q.async(function*(req, res) {
    try {
      var data = yield Q.all([getKnowledgeTest(req), parseUpdate(req)]);
      var knowledgeTest = _.extend(data[0], data[1]);
      knowledgeTest = yield queries.exec(knowledgeTest, 'save');
      scheduleTasks(knowledgeTest);
      res.status(202).jsonp(knowledgeTest);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.delete = Q.async(function*(req, res) {
    try {
      var knowledgeTest = yield getKnowledgeTest(req);
      yield queries.exec(knowledgeTest, 'remove');
      res.status(204).send();
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.studentList = Q.async(function*(req, res) {
    try {
      var filter = queries.filter(req.query);
      filter.where = _.merge(req.query.where || {}, {'answers._id': req.user._id});
      filter.select = {
        answers: {$elemMatch: {_id: req.user._id}},
        'question.text': 1,
        'question.answers': 1,
        'classroom.name': 1,
        'professor.displayName': 1,
        'end': 1,
        'start': 1,
      };

      var data = yield queries.findList(KnowledgeTest, filter);
      res.jsonp({length: data[0], list: data[1]});
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.studentAnswer = Q.async(function*(req, res) {
    try {
      var data = yield (new parser.Answer(req.body)).validate();

      var filter = {
        _id: req.params.id,
        open: true,
        answers: {$elemMatch: {_id: req.user._id, answer: {$ne: data.answer}}},
      };

      var update = {
        'answers.$.answer': data.answer,
        $push: { 'answers.$.triedAnswers': data.answer}
      };

      yield queries.exec(KnowledgeTest.update(filter, update));

      res.status(202).jsonp(data);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });
})();