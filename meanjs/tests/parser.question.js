'use strict';

var should = require('should');
var parser = require('./../app/parser.question');
var Q = require('q');

/**
 * Unit tests
 */
describe('Question Parser Unit Tests:', function() {

  describe('Save parser', function() {
    it('should validate', Q.async(function*() {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
        rightAnswer: 0
      };

      question = yield (new parser.Save(question)).validate();

      should.exist(question);
    }));

    it('should not validate', Q.async(function*() {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
      };

      var err;

      try {
        yield (new parser.Save(question)).validate();
      } catch (e) {
        err = e;
      }

      should(err).not.be.equal(undefined);
      should.exist(err.errors.rightAnswer);
    }));

    it('should ignore extra data', Q.async(function*() {
      var question = {
        text: 'Question test?',
        answers: ['answer 1', 'answer 2'],
        rightAnswer: 0,
        extra: {data: 'test'}
      };

      var data = yield (new parser.Save(question)).validate();

      should.exist(data);
      should.not.exist(data.extra);
    }));
  });
});