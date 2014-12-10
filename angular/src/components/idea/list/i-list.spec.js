'use strict';

describe('Directive: iList', function() {

  beforeEach(module('idea'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<i-list></i-list>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the iList directive');
  }));
});
