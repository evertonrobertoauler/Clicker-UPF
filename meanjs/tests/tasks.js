'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  KnowledgeTest = mongoose.model('KnowledgeTest'),
  Task = mongoose.model('Task'),
  moment = require('moment'),
  queries = require('./../app/queries'),
  tasks = require('./../app/tasks');

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

  it('should have 2 task scheduled', function(done) {
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
        tasks.schedule('openKnowledgeTest', [knowledgeTest._id], moment());

        setTimeout(function() {
          queries.exec(KnowledgeTest.findById(knowledgeTest._id))
            .then(function(knowledgeTest) {
              should(knowledgeTest.open).be.equal(true);
              done();
            })
            .fail(done);
        }, 5);
      })
      .fail(done);
  });

  it('should close the knowledge test', function(done) {
    knowledgeTest.open = false;
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
        }, 15);
      })
      .fail(done);
  });
});