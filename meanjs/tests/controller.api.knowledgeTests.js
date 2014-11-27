'use strict';

(function() {
  var should = require('should');
  var request = require('supertest');
  var mongoose = require('mongoose');
  var queries = require('./../app/queries');
  var moment = require('moment');
  var Q = require('q');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');
  var Question = mongoose.model('Question');
  var Classroom = mongoose.model('Classroom');

  var professor, student, question, classroom, knowledgeTest;

  describe('Knowledge Tests Controller Functional Tests:', function() {
    before(Q.async(function*() {
      this.app = require('./../server');

      professor = yield queries.exec(User.findOne({roles: 'professor'}));
      student = yield queries.exec(User.findOne({email: 'student2@test.com'}));

      var data = yield queries.execList([
        Token.findOne({user: professor}),
        Token.findOne({user: student}),
        Question.findOne({'professor._id': professor}),
        Classroom.findOne({'professor._id': professor}),
      ]);

      professor = data[0];
      student = data[1];
      question = data[2];
      classroom = data[3];
    }));


    describe('Professor', function() {
      it('should be able to create a knowledge test', function(done) {

        request(this.app)
          .post('/api/v1/professor/knowledge/tests')
          .set('Authorization', 'Bearer ' + professor.accessToken)
          .send({
            question: question._id,
            classroom: classroom._id,
            start: moment(),
            end: moment().add(5, 'minutes'),
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            knowledgeTest = res.body;

            done();
          });
      });

      it('should be able to update a knowledge test', function(done) {

        request(this.app)
          .patch('/api/v1/professor/knowledge/tests/' + knowledgeTest._id)
          .set('Authorization', 'Bearer ' + professor.accessToken)
          .send({
            start: knowledgeTest.start,
            end: moment(knowledgeTest.end).add(2, 'minutes'),
          })
          .expect('Content-Type', /json/)
          .expect(202)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to list his knowledge tests', function(done) {
        request(this.app)
          .get('/api/v1/professor/knowledge/tests')
          .set('Authorization', 'Bearer ' + professor.accessToken)
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

      it('should be able to get a knowledge test', function(done) {

        request(this.app)
          .get('/api/v1/professor/knowledge/tests/' + knowledgeTest._id)
          .set('Authorization', 'Bearer ' + professor.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to delete a knowledge test', function(done) {

        request(this.app)
          .delete('/api/v1/professor/knowledge/tests/' + knowledgeTest._id)
          .set('Authorization', 'Bearer ' + professor.accessToken)
          .expect(204)
          .end(function(err) {
            if (err) { throw err; }

            done();
          });
      });
    });

    describe('Student', function() {

      it('should be able to list his knowledge tests', function(done) {
        request(this.app)
          .get('/api/v1/student/knowledge/tests')
          .set('Authorization', 'Bearer ' + student.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);
            should.exist(res.body.length);
            (res.body.length).should.be.equal(1);

            knowledgeTest = res.body.list[0];
            should(knowledgeTest.answers.length).be.equal(1);

            should.exist(knowledgeTest.question);
            should.exist(knowledgeTest.question.text);
            should.exist(knowledgeTest.question.answers);
            should.not.exist(knowledgeTest.question.rightAnswer);

            done();
          });
      });
      
      it('should be able to update a knowledge test', function(done) {

        request(this.app)
          .patch('/api/v1/student/knowledge/tests/' + knowledgeTest._id)
          .set('Authorization', 'Bearer ' + student.accessToken)
          .send({answer: 2})
          .expect('Content-Type', /json/)
          .expect(202)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);
            should(res.body.answer).be.equal(2);

            done();
          });
      });
    });
  });
})();