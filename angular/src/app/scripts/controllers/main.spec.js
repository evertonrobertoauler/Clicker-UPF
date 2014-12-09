'use strict';

describe('Controller: MainCtrl', function() {

  beforeEach(module('openpiApp'));

  var MainCtrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a now variable to the scope', function() {
    expect(scope.now).toBeDefined();
  });
});
