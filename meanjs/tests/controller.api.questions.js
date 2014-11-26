'use strict';

(function() {
  var should = require('should');
  var request = require('supertest');
  var mongoose = require('mongoose');
  var queries = require('./../app/queries');
  var Q = require('q');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');

  var token, professor, question;

  describe('Question Controller Functional Tests:', function() {
    before(Q.async(function*() {
      this.app = require('./../server');
      professor = yield queries.exec(User.findOne({roles: 'professor'}));
      token = yield queries.exec(Token.findOne({user: professor}));
    }));


    describe('Professor', function() {
      it('should be able to create a question', function(done) {

        request(this.app)
          .post('/api/v1/professor/questions')
          .set('Authorization', 'Bearer ' + token.accessToken)
          .send({
            text: '1 * 2?',
            answers: ['0', '4', '2', '5'],
            rightAnswer: 2
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            question = res.body;

            done();
          });
      });

      it('should be able to update a question', function(done) {

        question.answers = ['0', '4', '2', '5', '3'];

        request(this.app)
          .put('/api/v1/professor/questions/' + question._id)
          .set('Authorization', 'Bearer ' + token.accessToken)
          .send(question)
          .expect('Content-Type', /json/)
          .expect(202)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to list his questions', function(done) {
        request(this.app)
          .get('/api/v1/professor/questions')
          .set('Authorization', 'Bearer ' + token.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);
            should.exist(res.body.length);
            (res.body.length).should.be.equal(2);

            done();
          });
      });

      it('should be able to get a question', function(done) {

        request(this.app)
          .get('/api/v1/professor/questions/' + question._id)
          .set('Authorization', 'Bearer ' + token.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to delete a question', function(done) {

        request(this.app)
          .delete('/api/v1/professor/questions/' + question._id)
          .set('Authorization', 'Bearer ' + token.accessToken)
          .expect(204)
          .end(function(err) {
            if (err) { throw err; }

            done();
          });
      });
    });
  });
})();