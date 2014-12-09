'use strict';

describe('Controller: ClassroomsCtrl', function() {

  beforeEach(module('openpiApp'));

  var ClassroomsCtrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassroomsCtrl = $controller('ClassroomsCtrl', {
      $scope: scope,
    });
  }));

  it('should attach classroom object to the scope', function() {
    expect(scope.classroom).toBeDefined();
  });
});
