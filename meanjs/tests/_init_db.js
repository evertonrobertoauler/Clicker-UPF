'use strict';

(function(){
  var queries = require('./../app/queries');
  var mongoose = require('mongoose');
  var _ = require('lodash');
  var token = require('./../app/controller.token');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');
  var Question = mongoose.model('Question');
  var Classroom = mongoose.model('Classroom');
  var KnowledgeTest = mongoose.model('KnowledgeTest');

  var baseUser = {
    firstName: 'Full',
    lastName: 'Name',
    displayName: 'Full Name',
    email: 'test@test.com',
    roles: ['user', 'student'],
    password: 'password',
    provider: 'local'
  };

  var professor = _.merge(baseUser, {email: 'professor@test.com', roles: ['user', 'professor']});
  var student1 = _.merge(baseUser, {email: 'student1@test.com'});
  var student2 = _.merge(baseUser, {email: 'student2@test.com'});
  var student3 = _.merge(baseUser, {email: 'student3@test.com'});

  var drop = queries.exec(mongoose.connection.db, 'dropDatabase');

  // TODO

})();