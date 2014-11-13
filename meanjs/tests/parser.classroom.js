'use strict';

var should = require('should');
var parser = require('./../app/parser.classroom');

/**
 * Unit tests
 */
describe('Classroom Parser Unit Tests:', function() {

  describe('Save parser', function() {
    it('should validate', function(done) {
      var classroom = {
        name: 'Classroom name',
        students: ['545abb01ea9c6bd5161278d5', '5463f57d3e1f8ed227a8e94a']
      };

      (new parser.Save(classroom)).validate()
        .then(function(data) {
          should.exist(data);
          should.exist(data.name);
          should.exist(data.students.length);
          (data.students.length).should.be.exactly(2);
          done();
        })
        .fail(done);
    });

    it('should not validate', function(done) {
      var classroom = {
        students: ['545abb01ea9c6bd5161278d5']
      };

      (new parser.Save(classroom)).validate()
        .fail(function(err) {
          should.exist(err);
          should.exist(err.errors.name);
          done();
        })
        .fail(done);
    });

    it('should ignore extra data', function(done) {
      var classroom = {
        name: 'Classroom name',
        students: ['545abb01ea9c6bd5161278d5', '5463f57d3e1f8ed227a8e94a'],
        extra: {data: 'test'}
      };

      (new parser.Save(classroom)).validate()
        .then(function(data) {
          should.exist(data);
          should.not.exist(data.extra);
          done();
        })
        .fail(done);
    });
  });
});