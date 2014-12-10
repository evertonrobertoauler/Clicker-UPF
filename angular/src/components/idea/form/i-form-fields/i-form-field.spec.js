'use strict';

describe('Directive: iFormField', function () {

  // load the directive's module
  beforeEach(module('idea'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<i-form-field type="email"></i-form-field>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
