'use strict';

(function() {

  var queries = require('./queries');
  var SaveParser = require('./parser.classroom').Save;
  var Classroom = require('mongoose').model('Classroom');
  var User = require('mongoose').model('User');
  var Q = require('q');
  var _ = require('lodash');
  var task = require('./tasks');

  var getStudents = function(classroom) {
    var query = User.find({_id: {$in: classroom.students || []}}).select('displayName');
    return queries.exec(query).then(function(students) {
      classroom.students = students;
      return classroom;
    });
  };

  var parseClassroom = function(req) {
    return (new SaveParser(req.body)).validate().then(getStudents);
  };

  var getClassroom = function(req) {
    return queries.exec(Classroom.findOne({
      _id: req.params.id,
      'professor._id': req.user._id
    }));
  };

  exports.list = Q.async(function*(req, res) {
    try {
      var filter = queries.filter(req.query);
      filter.where = _.merge(req.query.where || {}, {'professor._id': req.user._id});

      var data = yield queries.findList(Classroom, filter);
      res.jsonp({length: data[0], list: data[1]});
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.insert = Q.async(function*(req, res) {
    try {
      var body = yield parseClassroom(req);
      var classroom = new Classroom(body);
      classroom.professor = req.user;
      classroom = yield queries.exec(classroom, 'save');
      res.status(201).jsonp(classroom);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.get = Q.async(function*(req, res) {
    try {
      var classroom = yield getClassroom(req);
      res.jsonp(classroom);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.update = Q.async(function*(req, res) {
    try {
      var data = yield Q.all([getClassroom(req), parseClassroom(req)]);
      var classroom = _.extend(data[0], data[1]);
      classroom = yield queries.exec(classroom, 'save');
      task.schedule('updateOpenKnowledgeTest', [classroom._id]);
      res.status(202).jsonp(classroom);
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });

  exports.delete = Q.async(function*(req, res) {
    try {
      var classroom = yield getClassroom(req);
      yield queries.exec(classroom, 'remove');
      res.status(204).send();
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });
})();