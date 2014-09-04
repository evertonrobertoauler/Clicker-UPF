'use strict';

angular.module('idea').directive('iDate', function() {
		return {
			restrict: 'A',
			controller: function ($scope, $timeout) {

        $timeout(function(){
          $scope.dateModel = new Date($scope.getValue());
        }, 100);

        $scope.$watch('dateModel', function(){
          if (typeof $scope.dateModel !== 'undefined') {
            $scope.setValue($scope.dateModel || '');
          }
        });

        $scope.opened = false;

        $scope.openDatePicker = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = !angular.extend($scope.opened);
        };
			}
		};
	});