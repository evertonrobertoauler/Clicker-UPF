'use strict';

angular
  .module('openpiApp')
  .directive('iList', function() {
    return {
      templateUrl: '/views/directives/i-list/base.html',
      restrict: 'E',
      scope: {
        resource: '@',
        abstractState: '@',
      },
      controller: function($scope, $window, $injector) {

        var Resource = $injector.get($scope.resource);

        $scope.Resource = Resource;
        $scope.hasFilters = Resource.filters && Object.keys(Resource.filters).length;

        var query = {
          where: {},
          limit: 10
        };

        $scope.query = angular.copy(query);

        $scope.total = 0;

        $scope.getValue = function(obj, field) {
          $scope._obj = obj;
          return $scope.$eval('_obj.' + field);
        };

        $scope.submit = function() {
          $scope.result = $scope.Resource.query({
            q: JSON.stringify($scope.query)
          });

          $scope.msg = 'Consultando ...';

          $scope.result.$promise.then(function(result) {
            $scope.total = result.length;
            $scope.msg = !$scope.total ? 'Nenhum registro encontrado!' : '';
          });
        };

        $scope.reset = function() {
          $scope.query = angular.copy(query);
          $scope.submit();
        };

        $scope.delete = function(id) {
          if ($window.confirm('Você tem certeza que deseja excluir este registro?')) {
            $scope.Resource.delete({id: id}).$promise.then(function() {
              $scope.submit();
            });
          }
        };

        $scope.sort = function(index) {

          var col = Resource.columns[index];

          var fields = Array.isArray(col.field) ? col.field : [col.field];
          var sort = 0;

          switch (col.sort) {
            case 'down':
              col.sort = 'up';
              sort = -1;
              break;
            case 'up':
              col.sort = 0;
              delete $scope.query.sort;
              break;
            default:
              col.sort = 'down';
              sort = 1;
          }

          if ([-1, 1].indexOf(sort) !== -1) {
            $scope.query.sort = {};
            fields.forEach(function(field) {
              field = field === 'created' ? 'id' : field;
              $scope.query.sort[field] = sort;
            });
          }

          for (var i in Resource.columns) {
            if (parseInt(i) !== index) {
              Resource.columns[i].sort = '';
            }
          }

          $scope.submit();
        };

        $scope.submit();
      }
    };
  });
