'use strict';

describe('Controller: SignupCtrl', function () {

  // load the controller's module
  beforeEach(module('openpiApp'));

  var SignupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Auth) {
    scope = $rootScope.$new();
    scope.Auth = Auth;
    SignupCtrl = $controller('SignupCtrl', {
      $scope: scope
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user).toBeDefined();
  });
});
