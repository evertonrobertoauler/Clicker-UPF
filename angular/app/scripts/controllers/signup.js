'use strict';

angular
  .module('openpiApp')
  .controller('SignupCtrl', function($scope, AUTH_URL) {

    $scope.user = {};

    $scope.url = AUTH_URL;

    $scope.Auth.testLogin();

    $scope.signup = function() {
      $scope.Auth.userCreate($scope.user).error(function(errors) {
        $scope.iForm.setErrors(errors);
      });
    };
  });
