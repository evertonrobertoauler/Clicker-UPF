'use strict';

angular
  .module('openpiApp')
  .directive('iListDetail', function() {
    return {
      templateUrl: '/views/directives/i-list-detail/base.html',
      restrict: 'E',
      scope: {
        resource: '@',
        view: '@',
        where: '=',
        reload: '=',
      },
      controller: function($scope, $injector, $interval) {

        var Resource = $injector.get($scope.resource);

        $scope.Resource = Resource;

        var query = {
          where: $scope.where,
          limit: 5,
          offset: 1,
        };

        if ($scope.reload) {
          var interval = $interval(function(){
            $scope.submit();
          }, $scope.reload * 1000);

          $scope.$on('$stateChangeStart', function(){
            $interval.cancel(interval);
          });
        }

        $scope.total = 0;

        $scope.list = {};

        $scope.submit = function() {

          $scope.query = angular.copy(query);

          for (var i in $scope.query.where) {
            var value = $scope.query.where[i];

            if (value[0] === '$') {
              value = $scope.$parent.$parent.$eval(value.substr(1));
            }

            $scope.query.where[i] = value;
          }

          $scope.msg = 'Consultando ...';

          $scope.Resource.query({
            q: JSON.stringify($scope.query)
          }).$promise.then(function(result) {

              var ids = [];

              (result.list || []).forEach(function(obj) {
                var oldObj = $scope.list[obj.id];
                ids.push(obj.id);

                if (!oldObj) {
                  $scope.list[obj.id] = obj;
                } else if (JSON.stringify(oldObj) !== JSON.stringify(obj)) {
                  $scope.list[obj.id] = obj;
                }
              });

              for (var i in $scope.list) {
                if (ids.indexOf(i) === -1) {
                  delete $scope.list[i];
                }
              }

              $scope.total = result.length;
              $scope.msg = !$scope.total ? 'Nenhum registro encontrado!' : '';
            });
        };

        $scope.submit();
      }
    };
  });
