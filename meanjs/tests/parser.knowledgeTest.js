'use strict';

var should = require('should');
var parser = require('./../app/parser.knowledgeTest');
var Q = require('q');

/**
 * Unit tests
 */
describe('KnowledgeTest Parser Unit Tests:', function() {

  describe('Insert parser', function() {
    it('should validate', Q.async(function*() {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        classroom: '545abb01ea9c6bd5161278d5',
        start: new Date(),
        end: new Date()
      };

      var data = yield (new parser.Insert(knowledgeTest)).validate();
      should.exist(data);
    }));

    it('should not validate', function(done) {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        end: new Date()
      };

      return (new parser.Insert(knowledgeTest)).validate()
        .fail(function(err) {
          should.exist(err);
          should.exist(err.errors.classroom);
          should.exist(err.errors.start);
          done();
        });
    });

    it('should ignore extra data', Q.async(function*() {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        classroom: '545abb01ea9c6bd5161278d5',
        start: new Date(),
        end: new Date(),
        extraField: 'extra data',
      };

      var data = yield (new parser.Insert(knowledgeTest)).validate();
      should.exist(data);
      should.not.exist(data.extraField);
    }));
  });

  describe('Update parser', function() {
    it('should validate', Q.async(function*() {
      var knowledgeTest = {
        start: new Date(),
        end: new Date()
      };

      var data = yield (new parser.Update(knowledgeTest)).validate();
      should.exist(data);
    }));

    it('should not validate', function(done) {
      var knowledgeTest = {
        end: new Date()
      };

      (new parser.Update(knowledgeTest)).validate()
        .fail(function(err) {
          should.exist(err);
          should.exist(err.errors.start);
          done();
        })
        .fail(done);
    });

    it('should ignore extra data', Q.async(function*() {
      var knowledgeTest = {
        start: new Date(),
        end: new Date(),
        extraField: 'extra data',
      };

      var data = yield (new parser.Update(knowledgeTest)).validate();

      should.exist(data);
      should.not.exist(data.extraField);
    }));
  });
});