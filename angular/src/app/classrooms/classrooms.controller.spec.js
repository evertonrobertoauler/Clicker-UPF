'use strict';

describe('Controller: ClassroomsController', function () {

  beforeEach(module('openpiApp'));

  var ClassroomsController, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ClassroomsController = $controller('ClassroomsController', {
      $scope: scope,
    });
  }));

  it('should attach classroom object to the scope', function () {
    expect(scope.classroom).toBeDefined();
  });
});
