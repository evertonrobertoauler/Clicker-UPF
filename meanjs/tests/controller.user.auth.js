'use strict';

(function() {
  var should = require('should');
  var request = require('supertest');
  var auth;

  /**
   * Unit tests
   */
  describe('User Controller Functional Tests:', function() {

    before(function(done) {
      this.app = require('./../server');
      done();
    });

    describe('Signup', function() {
      it('should be able to signup without problems', function(done) {

        request(this.app)
          .post('/auth/signup')
          .send({
            email: 'test@example.com',
            firstName: 'Full',
            lastName: 'Name',
            password: 'test1234'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            should.exist(res.body.token);
            should.exist(res.body.token.accessToken);
            should.exist(res.body.token.refreshToken);

            done();
          });
      });
    });

    describe('Signin', function() {
      it('should be able to signin without problems', function(done) {

        request(this.app)
          .post('/auth/signin')
          .send({
            email: 'test@example.com',
            password: 'test1234'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) { throw err; }

            auth = res.body;

            should.exist(auth.user);
            should.exist(auth.token);
            should.exist(auth.token.accessToken);
            should.exist(auth.token.refreshToken);

            done();
          });
      });

      it('should return 401 Unauthorized', function(done) {
        request(this.app)
          .get('/api/v1/user')
          .expect('Content-Type', /json/)
          .expect(401)
          .end(function(err, res) {

            if (err) { throw err; }

            should(res.body.message).be.exactly('Bearer realm="Users"');

            done();
          });
      });

      it('should return 403 Forbidden', function(done) {
        should.exist(auth.token.accessToken);

        request(this.app)
          .get('/api/v1/professor/classrooms')
          .set('Authorization', 'Bearer ' + auth.token.accessToken)
          .expect(403)
          .end(done);
      });

      it('should be authenticated', function(done) {
        should.exist(auth.token.accessToken);

        request(this.app)
          .get('/api/v1/user')
          .set('Authorization', 'Bearer ' + auth.token.accessToken)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(done);
      });

      it('should refresh token', function(done) {
        should.exist(auth.token.refreshToken);

        request(this.app)
          .post('/auth/token')
          .send(auth.token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {

            if (err) { throw err; }

            should(res.body).not.containEql(auth.token);

            done();
          });
      });

      it('should not refresh token again', function(done) {
        request(this.app)
          .post('/auth/token')
          .send(auth.token)
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {
            if (err) { throw err; }

            should(res.body.error).be.exactly('Invalid token!');

            done();
          });
      });
    });
  });
})();