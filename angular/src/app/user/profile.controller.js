'use strict';

angular
  .module('openpiApp.user')
  .controller('ProfileController', function($scope, Auth) {

    $scope.user = angular.copy(Auth.getUser());

    $scope.update = function() {
      Auth
        .userUpdate($scope.user)
        .success(function() {
          $scope.updateMenu();
        })
        .error(function(errors) {
          $scope.iForm.setErrors(errors);
        });
    };
  });
