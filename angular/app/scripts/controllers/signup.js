'use strict';

angular
  .module('openpiApp')
  .controller('SignupCtrl', function($scope, Auth, AUTH_URL) {

    $scope.user = {};

    $scope.url = AUTH_URL;

    Auth.testLogin();

    $scope.signup = function() {
      Auth
        .userCreate($scope.user)
        .success(function() {
          $scope.updateMenu();
        })
        .error(function(errors) {
          $scope.iForm.setErrors(errors);
        });
    };
  });
