'use strict';

angular
  .module('openpiApp')
  .directive('iButtonSelect', function() {
    return {
      restrict: 'E',
      scope: {
        resource: '@',
      },
      controller: function($scope, $injector) {

        var Resource = $injector.get($scope.resource);

        $scope = $scope.$parent;

        $scope.selected = [];

        $scope.$watch('value', function(value) {
          if (Array.isArray(value) && typeof(value[0]) !== 'string') {
            $scope.selected = value || [];
          } else if (!$scope.field.multi && typeof(value) !== 'string') {
            $scope.selected = value && [value] || [];
          }
        });

        $scope.select = function(obj) {
          if ($scope.field.multi) {
            $scope.selected.push(obj);
          } else {
            $scope.selected = [obj];
          }
        };

        $scope.$watchCollection('selected', function() {
          var ids = $scope.selected.map(function(obj) { return obj._id; });
          $scope.setValue($scope.field.multi && ids || ids[0]);
          $scope.query.where = {_id: {$nin: ids}};
        }, true);

        $scope.$watchCollection('query', function() {
          $scope.submit();
        });

        $scope.Resource = Resource;

        $scope.query = {
          where: {},
          limit: 10,
          offset: 1,
        };

        $scope.total = 0;

        $scope.submit = function() {
          $scope.result = Resource.query({
            q: JSON.stringify($scope.query)
          });

          $scope.result.$promise.then(function(result) {
            $scope.total = result.length;
          });
        };
      }
    };
  });