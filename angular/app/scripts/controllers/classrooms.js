'use strict';

angular
  .module('openpiApp')
  .controller('ClassroomsCtrl', function($scope, $stateParams, $state, Classrooms) {

    if ($stateParams.id) {
      $scope.classroom = Classrooms.get({id: $stateParams.id});
    } else {
      $scope.classroom = new Classrooms();
    }

    $scope.save = function() {

      var error = function(e) {
        $scope.iForm.setErrors(e.data);
      };

      var success = function(c) {
        $state.transitionTo('classrooms.detail', c);
      };

      if (!$scope.classroom.id) {
        $scope.classroom.$insert(success, error);
      } else {
        $scope.classroom.$update(success, error);
      }
    };

  });
