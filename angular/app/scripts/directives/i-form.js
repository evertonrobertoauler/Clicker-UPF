'use strict';

angular
  .module('openpiApp')
  .directive('iForm', function($compile) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 1000,
      link: function(scope, elem) {
        if (elem.attr('i-form') !== undefined) {

          scope.showErrors = function() {
            scope.iForm.showErrors = true;
            return true;
          };

          var tests = [
            'showErrors()', 'iForm.form.$valid', elem.attr('i-form')
          ].filter(function(v) { return v; });

          scope.iForm = {
            fields: {},
            setErrors: function(errors) {
              for (var field in scope.iForm.fields) {
                scope.iForm.fields[field].errors = errors[field];
              }
            },
          };

          elem.removeAttr('i-form');
          elem.attr('name', 'iForm.form');
          elem.attr('novalidate', '');
          elem.attr('class', elem.attr('class') + ' form-horizontal');
          elem.attr('ng-submit', tests.join(' && '));
          $compile(elem)(scope);
        }
      }
    };
  });
