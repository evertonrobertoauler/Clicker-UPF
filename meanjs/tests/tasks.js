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
  before(Q.async(function* () {
    knowledgeTest = yield queries.exec(KnowledgeTest.findOne());
  }));

  it('should have 2 tasks scheduled', Q.async(function* () {
    var count = yield queries.exec(Task.find().count());
    should(count).be.exactly(2);
  }));

  it('should open the knowledge test', Q.async(function* () {
    knowledgeTest.open = false;
    knowledgeTest.start = moment();
    knowledgeTest.end = moment().add(5, 'seconds');
    knowledgeTest = yield queries.exec(knowledgeTest, 'save');

    tasks.schedule('openKnowledgeTest', [knowledgeTest._id]);

    yield Q.delay(0, 15);

    knowledgeTest = yield queries.exec(KnowledgeTest.findById(knowledgeTest._id));

    should(knowledgeTest.open).be.equal(true);
    should(knowledgeTest.answers.length).be.equal(2);
  }));

  it('should close the knowledge test', Q.async(function* () {
    knowledgeTest.open = true;
    knowledgeTest.end = moment().add(1, 'milliseconds');
    knowledgeTest = yield queries.exec(knowledgeTest, 'save');

    tasks.schedule('closeKnowledgeTest', [knowledgeTest._id], knowledgeTest.end);

    yield Q.delay(0, 10);

    knowledgeTest = yield queries.exec(KnowledgeTest.findById(knowledgeTest._id));

    should(knowledgeTest.open).be.equal(false);
  }));

  it('should reopen the knowledge test', Q.async(function* () {
    knowledgeTest.open = false;
    knowledgeTest.end = moment().add(5, 'seconds');
    knowledgeTest.answers[1].answer = 1;
    knowledgeTest.answers[1].triedAnswers = [1];

    knowledgeTest = yield queries.exec(knowledgeTest, 'save');

    tasks.schedule('openKnowledgeTest', [knowledgeTest._id]);

    yield Q.delay(0, 15);

    knowledgeTest = yield queries.exec(KnowledgeTest.findById(knowledgeTest._id));

    should(knowledgeTest.open).be.equal(true);
    should(knowledgeTest.answers.length).be.equal(2);
    should(knowledgeTest.answers[1].answer).be.equal(1);
  }));

  it('should update open knowledge test when classroom changes', Q.async(function* () {

    var promises = [
      queries.exec(Classroom.findOne()),
      queries.exec(User.findOne({email: 'student1@test.com'}))
    ];

    var data = yield Q.all(promises);

    var classroom = data[0];
    classroom.students.push(data[1]);

    classroom = yield queries.exec(classroom, 'save');

    tasks.schedule('updateOpenKnowledgeTest', [classroom._id]);

    yield Q.delay(0, 20);

    knowledgeTest = yield queries.exec(KnowledgeTest.findById(knowledgeTest._id));

    should(knowledgeTest.answers.length).be.equal(3);
    should(knowledgeTest.answers[1].answer).be.equal(1);
  }));
});