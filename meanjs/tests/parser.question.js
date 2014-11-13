'use strict';

var should = require('should');
var parser = require('./../app/parser.question');

/**
 * Unit tests
 */
describe('Question Parser Unit Tests:', function() {

  describe('Save parser', function() {
    it('should validate', function(done) {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
        rightAnswer: 0
      };

      (new parser.Save(question)).validate()
        .then(function(data) {
          should.exist(data);
          done();
        });
    });

    it('should not validate', function(done) {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
      };

      (new parser.Save(question)).validate()
        .fail(function(err) {
          should.exist(err);
          should.exist(err.errors.rightAnswer);
          done();
        });
    });

    it('should ignore extra data', function(done) {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
        rightAnswer: 0,
        extra: {data: 'test'}
      };

      (new parser.Save(question)).validate()
        .then(function(data) {
          should.exist(data);
          should.not.exist(data.extra);
          done();
        });
    });
  });
});