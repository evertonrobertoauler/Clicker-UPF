'use strict';

angular.module('idea').directive('iButtonSelect', function() {
  return {
    restrict: 'A',
    controller: function ($scope, $timeout) {

      $timeout(function(){
        $scope.selected = $scope.getValue() || [];
      }, 100);

      $scope.$watch('selected', function(){
        if (typeof $scope.selected !== 'undefined') {
          $scope.setValue($scope.selected || []);
        }
      }, true);
    }
  };
});