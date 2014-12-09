'use strict';

angular
  .module('openpiApp')
  .controller('AuthCtrl', function($scope, $stateParams, Auth, AUTH_URL) {

    if ($stateParams.refresh) {
      Auth
        .refreshLogin({refreshToken: $stateParams.refresh})
        .success(function() {
          $scope.updateMenu();
        });
    } else {
      Auth.testLogin();
    }

    $scope.url = AUTH_URL;

    $scope.user = {};

    $scope.login = function() {
      Auth
        .login($scope.user.email, $scope.user.password)
        .success(function() {
          $scope.updateMenu();
        })
        .error(function() {
          $scope.error = 'Login inválido!';
        });
    };
  });