'use strict';

angular.module('idea').directive('iModel', function ($compile) {
  return {
    restrict: 'A',
    link: function postLink(scope, elem) {
      if (elem.attr('i-model') !== undefined) {

        scope.$watch('value', function (value) {
          if (value !== undefined) {
            scope.$parent.$parent.$eval(scope.$parent.model + ' = ' + JSON.stringify(value) + ';');
          }
        });

        scope.$parent.$parent.$watch(scope.$parent.model, function (value) {
          if (value !== undefined) {
            scope.value = value;
          }
        });

        scope.setValue = function(value){
          scope.value = value;
        };

        scope.getValue = function(){
          return scope.value;
        };

        elem.attr('ng-model', 'value');
        elem.attr('name', scope.$parent.name || scope.$parent.model);
        elem.removeAttr('i-model');
        $compile(elem)(scope);
      }
    }
  };
});
