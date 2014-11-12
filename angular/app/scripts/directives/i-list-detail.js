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
      },
      controller: function($scope, $injector, Socket) {

        var Resource = $injector.get($scope.resource);

        $scope.Resource = Resource;

        var query = {
          where: $scope.where || {},
          limit: 5,
          offset: 1,
        };

        var cb = function(obj) {
          if (obj._id) {
            $scope.list[obj._id] = obj;
          }
        };

        Socket.on($scope.resource, cb);

        $scope.$on('$stateChangeStart', function() {
          Socket.off($scope.resource, cb);
        });

        $scope.total = 0;

        $scope.list = {};

        $scope.submit = function() {

          $scope.query = angular.copy(query);

          $scope.msg = 'Consultando ...';

          $scope.Resource.query({
            q: JSON.stringify($scope.query)
          }).$promise.then(function(result) {

              var ids = [];

              (result.list || []).forEach(function(obj) {
                var oldObj = $scope.list[obj._id];
                ids.push(obj._id);

                if (!oldObj) {
                  $scope.list[obj._id] = obj;
                } else if (JSON.stringify(oldObj) !== JSON.stringify(obj)) {
                  $scope.list[obj._id] = obj;
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
