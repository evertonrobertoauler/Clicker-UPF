'use strict';

describe('Service: Classrooms', function() {

  beforeEach(module('openpiApp'));

  var Classrooms;
  beforeEach(inject(function(_Classrooms_) {
    Classrooms = _Classrooms_;
  }));

  it('should do something', function() {
    expect(!!Classrooms).toBe(true);
  });

});
