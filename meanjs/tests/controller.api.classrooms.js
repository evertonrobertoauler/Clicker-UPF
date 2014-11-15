'use strict';

(function() {
  var should = require('should');
  var request = require('supertest');
  var mongoose = require('mongoose');
  var queries = require('./../app/queries');

  var User = mongoose.model('User');
  var Token = mongoose.model('Token');

  var token, professor, students, classroom;

  describe('Classrooms Controller Functional Tests:', function() {
    before(function(done) {
      this.app = require('./../server');

      queries.exec(User.findOne({roles: 'professor'}))
        .then(function(user) {
          professor = user;
          return queries.execList([
            User.find({roles: 'student'}),
            Token.findOne({user: professor}),
          ]);
        })
        .then(function(data) {
          students = data[0];
          token = data[1];
          done();
        })
        .fail(done);
    });


    describe('Professor', function() {
      it('should be able to create a classroom', function(done) {

        request(this.app)
          .post('/api/v1/professor/classrooms')
          .set('Authorization', 'Bearer ' + token.accessToken)
          .send({
            name: 'New Classroom',
            students: students.map(function(s) { return s._id.toString(); }),
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            classroom = res.body;

            done();
          });
      });

      it('should be able to update a classroom', function(done) {

        classroom.students = classroom.students.slice(1).map(function(s){
          return s._id;
        });

        request(this.app)
          .put('/api/v1/professor/classrooms/' + classroom._id)
          .set('Authorization', 'Bearer ' + token.accessToken)
          .send(classroom)
          .expect('Content-Type', /json/)
          .expect(202)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to list his classrooms', function(done) {
        request(this.app)
          .get('/api/v1/professor/classrooms')
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

      it('should be able to get a classroom', function(done) {

        request(this.app)
          .get('/api/v1/professor/classrooms/' + classroom._id)
          .set('Authorization', 'Bearer ' + token.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body);

            done();
          });
      });

      it('should be able to delete a classroom', function(done) {

        request(this.app)
          .delete('/api/v1/professor/classrooms/' + classroom._id)
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