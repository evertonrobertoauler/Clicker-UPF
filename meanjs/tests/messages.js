'use strict';

var should = require('should');
var messages = require('./../app/messages');

describe('Message Service Functional Tests:', function() {
  it('should send message', function() {
    return messages.send('testQueue', 'testName', {hello: 'World'});
  });

  it('should receive message', function(done) {
    messages.recv('testQueue', function(name, data) {
      should(name).be.equal('testName');
      should.exist(data);
      should(data.hello).be.equal('World');
      done();
    }).fail(done);
  });
});