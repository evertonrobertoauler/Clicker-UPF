'use strict';

(function() {

  var queries = require('./queries');
  var SaveParser = require('./parser.classroom').Save;
  var Classroom = require('mongoose').model('Classroom');
  var User = require('mongoose').model('User');
  var Q = require('q');
  var _ = require('lodash');

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

  exports.list = function(req, res) {

    var filter = queries.filter(req.query);
    filter.where = _.merge(req.query.where || {}, {'professor._id': req.user._id});

    queries.findList(Classroom, filter)
      .then(function(data) {
        res.jsonp({length: data[0], list: data[1]});
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.insert = function(req, res) {
    parseClassroom(req)
      .then(function(data) {
        var classroom = new Classroom(data);
        classroom.professor = req.user;
        return queries.exec(classroom, 'save');
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
    getClassroom(req)
      .then(function(data) {
        res.jsonp(data);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.update = function(req, res) {
    Q.all([getClassroom(req), parseClassroom(req)])
      .then(function(data) {
        var classroom = _.extend(data[0], data[1]);
        return queries.exec(classroom, 'save');
      })
      .then(function(classroom) {
        res.status(202).jsonp(classroom);
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };

  exports.delete = function(req, res) {
    getClassroom(req)
      .then(function(classroom) {
        return queries.exec(classroom, 'remove');
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