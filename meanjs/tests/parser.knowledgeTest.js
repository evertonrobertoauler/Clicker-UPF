'use strict';

var should = require('should');
var parser = require('./../app/parser.knowledgeTest');

/**
 * Unit tests
 */
describe('KnowledgeTest Parser Unit Tests:', function() {

  describe('Insert parser', function() {
    it('should validate', function(done) {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        classroom: '545abb01ea9c6bd5161278d5',
        start: new Date(),
        end: new Date()
      };

      (new parser.Insert(knowledgeTest)).validate()
        .then(function(data) {
          should.exist(data);
          done();
        })
        .fail(done);
    });

    it('should not validate', function(done) {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        end: new Date()
      };

      (new parser.Insert(knowledgeTest)).validate()
        .fail(function(err) {
          should.exist(err);
          should.exist(err.errors.classroom);
          should.exist(err.errors.start);
          done();
        })
        .fail(done);
    });

    it('should ignore extra data', function(done) {
      var knowledgeTest = {
        question: '5463f57d3e1f8ed227a8e94a',
        classroom: '545abb01ea9c6bd5161278d5',
        start: new Date(),
        end: new Date(),
        extraField: 'extra data',
      };

      (new parser.Insert(knowledgeTest)).validate()
        .then(function(data) {
          should.exist(data);
          should.not.exist(data.extraField);
          done();
        })
        .fail(done);
    });
  });

  describe('Update parser', function() {
    it('should validate', function(done) {
      var knowledgeTest = {
        start: new Date(),
        end: new Date()
      };

      (new parser.Update(knowledgeTest)).validate()
        .then(function(data) {
          should.exist(data);
          done();
        })
        .fail(done);
    });

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

    it('should ignore extra data', function(done) {
      var knowledgeTest = {
        start: new Date(),
        end: new Date(),
        extraField: 'extra data',
      };

      (new parser.Update(knowledgeTest)).validate()
        .then(function(data) {
          should.exist(data);
          should.not.exist(data.extraField);
          done();
        })
        .fail(done);
    });
  });
});