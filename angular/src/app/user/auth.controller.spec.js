'use strict';

describe('Controller: AuthController', function () {

  beforeEach(module('openpiApp.user'));

  var AuthController, scope;

  beforeEach(inject(function ($controller, $rootScope, Auth) {
    scope = $rootScope.$new();
    scope.Auth = Auth;
    AuthController = $controller('AuthController', {
      $scope: scope
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user).toBeDefined();
  });
});
