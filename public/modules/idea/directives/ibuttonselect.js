'use strict';

angular.module('idea').directive('iButtonSelect', function() {
  return {
    restrict: 'A',
    controller: function($scope, $timeout) {

      $timeout(function() {
        $scope.selected = $scope.getValue() || [];
      }, 100);

      $scope.$watch('selected', function() {
        if (typeof $scope.selected !== 'undefined') {

          if (!$scope.selected.length || $scope.selected.some(function(v) { return !v; })) {
            $scope.setValue('');
          } else {
            $scope.setValue($scope.selected);
          }
        }
      }, true);
    }
  };
});