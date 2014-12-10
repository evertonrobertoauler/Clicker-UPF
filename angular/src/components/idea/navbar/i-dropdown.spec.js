'use strict';

describe('Directive: iDropdown', function () {

  // load the directive's module
  beforeEach(module('idea'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<i-dropdown></i-dropdown>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the iDropdown directive');
  }));
});
