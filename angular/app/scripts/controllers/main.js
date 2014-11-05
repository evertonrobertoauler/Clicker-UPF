'use strict';

angular.module('openpiApp')
  .controller('MainCtrl', function($scope) {
    $scope.now = function() { return new Date(); };
  });
