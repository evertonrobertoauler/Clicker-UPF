'use strict';

angular
  .module('openpiApp')
  .controller('AuthCtrl', function($scope, $stateParams, AUTH_URL) {

    if ($stateParams.refresh) {
      $scope.Auth.saveToken({
        expires_in: 36000,
        refreshToken: $stateParams.refresh,
        token_type: 'Bearer'
      });

      window.alert($stateParams.refresh);

      $scope.Auth.getUserData();
    } else {
      $scope.Auth.testLogin();
    }

    $scope.url = AUTH_URL;

    $scope.user = {};

    $scope.login = function() {
      $scope.Auth
        .login($scope.user.email, $scope.user.password)
        .success($scope.Auth.getUserData)
        .error(function() {
          $scope.error = 'Login inválido!';
        });
    };
  });