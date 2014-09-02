'use strict';

angular.module('idea')
  .directive('iList', function() {
    return {
      templateUrl: '/modules/idea/views/directives/ilist/base.html',
      restrict: 'E',
      scope: {
        config: '=',
        resource: '=',
        whereFields: '=',
        href: '@',
      },
      controller: function($scope, $window) {

        $scope.hasWhere = $scope.whereFields && Object.keys($scope.whereFields).length;

        $scope.query = {where: {}};

        $scope.total = 0;

        $scope.getValue = function(obj, field){
          $scope._obj = obj;
          return $scope.$eval('_obj.' + field);
        };

        $scope.submit = function() {
          $scope.result = $scope.resource.query({
            q: JSON.stringify($scope.query)
          });

          $scope.result.$promise.then(function(result) {
            $scope.total = result.length;
          });
        };

        $scope.reset = function() {
          $scope.query.where = {};
          $scope.query.offset = 0;

          $scope.submit();
        };

        $scope.delete = function(id) {
          if ($window.confirm('Você tem certeza que deseja excluir este registro?')) {
            $scope.resource.delete({id: id}).$promise.then(function() {
              $scope.submit();
            });
          }
        };

        $scope.sort = function(index) {

          var col = $scope.config[index];

          var fields = Array.isArray(col.field) ? col.field : [col.field];
          var sort = 0;

          switch (col.sort) {
            case 'down':
              col.sort = 'up';
              sort = -1;
              break;
            case 'up':
              col.sort = '';
              delete $scope.query.sort;
              break;
            default:
              col.sort = 'down';
              sort = 1;
          }

          if ([-1, 1].indexOf(sort) !== -1)
          {
            $scope.query.sort = {};
            fields.forEach(function(field){
              $scope.query.sort[field] = sort;
            });
          }

          for (var i in $scope.config) {
            if (parseInt(i) !== index) {
              $scope.config[i].sort = '';
            }
          }

          $scope.submit();
        };

        $scope.submit();
      }
    };
  });
