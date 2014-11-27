'use strict';

module.exports = function(grunt, done) {

  require('./../config/init')();
  require('./../config/mongodb')(require('./../config/config'));
  require('./../config/express')();
  require('./../config/passport')();

  var queries = require('./../app/queries');
  var mongoose = require('mongoose');
  var _ = require('lodash');
  var Q = require('q');
  var token = require('./../app/controller.token');
  var moment = require('moment');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');
  var Question = mongoose.model('Question');
  var Classroom = mongoose.model('Classroom');
  var KnowledgeTest = mongoose.model('KnowledgeTest');
  var Task = mongoose.model('Task');

  var promise = Q.async(function* () {

    var drop = function(c) { return queries.exec(c.find().remove()); };
    var collections = [User, Token, Question, Classroom, KnowledgeTest, Task];
    yield Q.all(collections.map(drop));

    var baseUser = {
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'student'],
      password: 'password',
      provider: 'local'
    };

    var student1 = new User(_.merge(baseUser, {email: 'student1@test.com'}));
    var student2 = new User(_.merge(baseUser, {email: 'student2@test.com'}));
    var student3 = new User(_.merge(baseUser, {email: 'student3@test.com'}));

    var professor = new User(_.merge(baseUser, {
      email: 'professor@test.com',
      roles: ['user', 'professor']
    }));

    var students = [student1, student2, student3];
    var users = [professor].concat(students);

    users = yield queries.execList(users, 'save');

    yield Q.all(users.map(token.create));

    professor = users[0].toObject();
    students = users.slice(2);

    var classroom = new Classroom({
      name: 'Class 1',
      professor: professor,
      students: students
    });

    var question = new Question({
      text: '1 + 1?',
      answers: ['1', '2', '5', '3', '0'],
      rightAnswer: 1, // '2'
      professor: professor,
    });

    var docs = yield queries.execList([classroom, question], 'save');

    var knowledgeTest = new KnowledgeTest({
      professor: professor,
      classroom: docs[0].toObject(),
      question: docs[1].toObject(),
      start: moment(),
      end: moment().add(5, 'minutes'),
      answers: students.slice(0, 1),
      open: true,
    });

    return queries.exec(knowledgeTest, 'save');
  });

  promise()
    .then(function() {
      grunt.log.ok('Database successfully initialized.');
    })
    .fail(function(err) {
      grunt.log.error(err);
    })
    .fin(function() {
      mongoose.disconnect(done);
    });
};