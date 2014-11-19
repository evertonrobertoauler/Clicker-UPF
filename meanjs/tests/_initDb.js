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

  var baseUser = {
    firstName: 'Full',
    lastName: 'Name',
    displayName: 'Full Name',
    email: 'test@test.com',
    roles: ['user', 'student'],
    password: 'password',
    provider: 'local'
  };

  var professor = new User(_.merge(baseUser, {
    email: 'professor@test.com',
    roles: ['user', 'professor']
  }));

  var student1 = new User(_.merge(baseUser, {email: 'student1@test.com'}));
  var student2 = new User(_.merge(baseUser, {email: 'student2@test.com'}));
  var student3 = new User(_.merge(baseUser, {email: 'student3@test.com'}));

  var students = [student1, student2, student3];
  var users = students.concat([professor]);

  var classroom = new Classroom({
    name: 'Class 1',
    professor: professor,
    students: students
  });

  var question = new Question({
    text: '1 + 1?',
    answers: ['1', '2', '5', '3', '0'],
    rightAnswer: 1, // '2'
  });

  var knowledgeTest = new KnowledgeTest({
    professor: professor,
    question: question,
    classroom: classroom,
    start: moment(),
    end: moment().add(5, 'minutes'),
  });

  var dropCollections = function() {
    var drop = function(c) { return queries.exec(c.find().remove()); };
    var collections = [User, Token, Question, Classroom, KnowledgeTest, Task];
    return Q.all(collections.map(drop));
  };

  var saveList = function(models) {
    return function() {
      return queries.execList(models, 'save');
    };
  };

  var createTokens = function(users) {
    return Q.all(users.map(token.create));
  };

  dropCollections()
    .then(saveList(users))
    .then(function(users){
      question.professor = users[0];
      classroom.professor = users[0];
      classroom.students = users.slice(2);
      knowledgeTest.professor = users[0];
      return users;
    })
    .then(createTokens)
    .then(saveList([question, classroom]))
    .then(function(data){
      knowledgeTest.question = data[0];
      knowledgeTest.classroom = data[1];
      return queries.exec(knowledgeTest, 'save');
    })
    .then(function() {
      grunt.log.ok('Database successfully initialized.');
      mongoose.disconnect(done);
    })
    .fail(function(err) {
      grunt.log.error(err);
      mongoose.disconnect(done);
    });
};