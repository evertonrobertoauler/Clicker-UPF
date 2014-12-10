'use strict';

describe('Directive: iNav', function () {

  // load the directive's module
  beforeEach(module('idea'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nav i-nav></nav>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
