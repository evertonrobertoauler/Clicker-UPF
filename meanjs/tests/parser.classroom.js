'use strict';

var should = require('should');
var parser = require('./../app/parser.classroom');
var Q = require('q');

/**
 * Unit tests
 */
describe('Classroom Parser Unit Tests:', function() {

  describe('Save parser', function() {
    it('should validate', Q.async(function*() {
      var classroom = {
        name: 'Classroom name',
        students: ['545abb01ea9c6bd5161278d5', '5463f57d3e1f8ed227a8e94a']
      };

      var data = yield (new parser.Save(classroom)).validate();

      should.exist(data);
      should.exist(data.name);
      should.exist(data.students.length);
      (data.students.length).should.be.exactly(2);
    }));

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

    it('should ignore extra data', Q.async(function*() {
      var classroom = {
        name: 'Classroom name',
        students: ['545abb01ea9c6bd5161278d5', '5463f57d3e1f8ed227a8e94a'],
        extra: {data: 'test'}
      };

      var data = yield (new parser.Save(classroom)).validate();

      should.exist(data);
      should.not.exist(data.extra);
    }));
  });
});