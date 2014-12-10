'use strict';

angular
  .module('idea')
  .directive('iStringList', function() {
    return {
      restrict: 'A',
      controller: function($scope) {

        $scope.$watch('value', function(value){
          $scope.selected = value || [];
        });

        $scope.$watch('selected', function() {
          if (typeof $scope.selected !== 'undefined') {

            var allRequired = $scope.field.ngModel && $scope.field.validators.allRequired;
            var valid = true;

            if ($scope.selected.length && $scope.selected.some(function(v) { return !v; })) {
              valid = false;
            } else if ($scope.selected.length) {
              $scope.setValue($scope.selected);
            } else {
              $scope.setValue('');
            }

            if (allRequired) {
              $scope.field.ngModel.$setValidity('allRequired', valid);
            }
          }
        }, true);
      }
    };
  });
