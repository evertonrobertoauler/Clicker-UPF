'use strict';

angular
  .module('openpiApp')
  .controller('ProfileCtrl', function($scope) {

    $scope.user = angular.copy($scope.Auth.user);

    $scope.update = function() {
      $scope.Auth.userUpdate($scope.user).error(function(errors) {
        $scope.iForm.setErrors(errors);
      });
    };
  });