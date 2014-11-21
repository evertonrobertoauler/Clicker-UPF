'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  KnowledgeTest = mongoose.model('KnowledgeTest'),
  Classroom = mongoose.model('Classroom'),
  User = mongoose.model('User'),
  Task = mongoose.model('Task'),
  moment = require('moment'),
  queries = require('./../app/queries'),
  tasks = require('./../app/tasks'),
  Q = require('q');

var knowledgeTest;

describe('Task Schedule Unit Tests:', function() {
  before(function(done) {
    queries.exec(KnowledgeTest.findOne())
      .then(function(data) {
        knowledgeTest = data;
        done();
      })
      .fail(done);
  });

  it('should have 2 tasks scheduled', function(done) {
    queries.exec(Task.find().count())
      .then(function(count) {
        should(count).be.exactly(2);
        done();
      })
      .fail(done);
  });

  it('should open the knowledge test', function(done) {
    knowledgeTest.open = false;
    knowledgeTest.start = moment();
    knowledgeTest.end = moment().add(5, 'seconds');
    queries.exec(knowledgeTest, 'save')
      .then(function() {
        tasks.schedule('openKnowledgeTest', [knowledgeTest._id]);

        setTimeout(function() {
          queries.exec(KnowledgeTest.findById(knowledgeTest._id))
            .then(function(kt) {
              should(kt.open).be.equal(true);
              should(kt.answers.length).be.equal(2);
              knowledgeTest = kt;
              done();
            })
            .fail(done);
        }, 15);
      })
      .fail(done);
  });

  it('should close the knowledge test', function(done) {
    knowledgeTest.open = true;
    knowledgeTest.end = moment().add(1, 'milliseconds');
    queries.exec(knowledgeTest, 'save')
      .then(function() {
        tasks.schedule('closeKnowledgeTest', [knowledgeTest._id], knowledgeTest.end);

        setTimeout(function() {
          queries.exec(KnowledgeTest.findById(knowledgeTest._id))
            .then(function(knowledgeTest) {
              should(knowledgeTest.open).be.equal(false);
              done();
            })
            .fail(done);
        }, 25);
      })
      .fail(done);
  });

  it('should reopen the knowledge test', function(done) {
    knowledgeTest.open = false;
    knowledgeTest.end = moment().add(5, 'seconds');
    knowledgeTest.answers[1].answer = 1;
    knowledgeTest.answers[1].triedAnswers = [1];
    queries.exec(knowledgeTest, 'save')
      .then(function() {
        tasks.schedule('openKnowledgeTest', [knowledgeTest._id]);

        setTimeout(function() {
          queries.exec(KnowledgeTest.findById(knowledgeTest._id))
            .then(function(kt) {
              should(kt.open).be.equal(true);
              should(kt.answers.length).be.equal(2);
              should(kt.answers[1].answer).be.equal(1);
              done();
            })
            .fail(done);
        }, 15);
      })
      .fail(done);
  });

  it('should update open knowledge test when classroom changes', function(done) {

    var promises = [
      queries.exec(Classroom.findOne()),
      queries.exec(User.findOne({email: 'student1@test.com'}))
    ];

    var classroom;

    Q.all(promises)
      .then(function(data){
        classroom = data[0];
        classroom.students.push(data[1]);
        return queries.exec(classroom, 'save');
      })
      .then(function(){
        tasks.schedule('updateOpenKnowledgeTest', [classroom._id]);
        setTimeout(function() {
          queries.exec(KnowledgeTest.findById(knowledgeTest._id))
            .then(function(kt) {
              should(kt.answers.length).be.equal(3);
              should(kt.answers[1].answer).be.equal(1);
              done();
            })
            .fail(done);
        }, 35);
      })
      .fail(done);
  });
});