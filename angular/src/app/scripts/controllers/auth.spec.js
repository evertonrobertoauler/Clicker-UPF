'use strict';

describe('Controller: AuthCtrl', function () {

  beforeEach(module('openpiApp'));

  var AuthCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope, Auth) {
    scope = $rootScope.$new();
    scope.Auth = Auth;
    AuthCtrl = $controller('AuthCtrl', {
      $scope: scope
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user).toBeDefined();
  });
});
