'use strict';

angular.module('idea').directive('iForm', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, elem) {
      if (elem.attr('i-form') !== undefined) {

        scope.showErrors = function () {
          scope.iForm.showErrors = true;
          return true;
        };

        var tests = [
          'showErrors()', 'iForm.$valid', elem.attr('i-form')
        ].filter(function (v) { return v; });


        elem.removeAttr('i-form');
        elem.attr('name', 'iForm');
        elem.attr('novalidate', '');
        elem.attr('class', elem.attr('class') + ' form-horizontal');
        elem.attr('ng-submit', tests.join(' && '));
        $compile(elem)(scope);
      }
    }
  };
});
