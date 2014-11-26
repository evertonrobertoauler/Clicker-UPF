'use strict';

(function() {
  var should = require('should');
  var request = require('supertest');
  var mongoose = require('mongoose');
  var queries = require('./../app/queries');
  var Q = require('q');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');

  var token, professor;

  describe('Students Controller Functional Tests:', function() {
    before(Q.async(function*() {
      this.app = require('./../server');

      professor = yield queries.exec(User.findOne({roles: 'professor'}));
      token = yield queries.exec(Token.findOne({user: professor}));
    }));

    describe('Professor', function() {
      it('should be able to list his classrooms', function(done) {
        request(this.app)
          .get('/api/v1/professor/students')
          .set('Authorization', 'Bearer ' + token.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);
            should.exist(res.body.length);
            (res.body.length).should.be.equal(3);

            done();
          });
      });
    });
  });
})();