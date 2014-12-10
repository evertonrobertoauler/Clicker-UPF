'use strict';

describe('Controller: SignupController', function () {

  // load the controller's module
  beforeEach(module('openpiApp.user'));

  var SignupController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Auth) {
    scope = $rootScope.$new();
    scope.Auth = Auth;
    SignupController = $controller('SignupController', {
      $scope: scope
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user).toBeDefined();
  });
});
