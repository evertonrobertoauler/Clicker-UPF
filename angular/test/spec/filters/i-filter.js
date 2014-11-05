'use strict';

describe('Filter: iFilter', function() {

  // load the filter's module
  beforeEach(module('openpiApp'));

  // initialize a new instance of the filter before each test
  var iFilter;
  beforeEach(inject(function($filter) {
    iFilter = $filter('iFilter');
  }));

  it('should apply list column filter', function() {
    var obj = {test: 10};
    var col = {field: 'test', filter: {number: 2}};
    expect(iFilter(obj, col)).toBe('10.00');
  });

});
