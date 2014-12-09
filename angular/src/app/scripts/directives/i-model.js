'use strict';

angular
  .module('openpiApp')
  .directive('iModel', function($compile) {

    var angularDirectives = [
      'required', 'minlength', 'maxlength', 'pattern'
    ];

    return {
      restrict: 'A',
      priority: 100,
      link: function(scope, elem) {
        scope.$watch('value', function(value) {
          if (
            JSON.stringify(scope.$parent.$parent.$eval(scope.$parent.model)) !== JSON.stringify(value)
            ) {
            scope.$parent.$parent.evalValue = value;
            scope.$parent.$parent.$eval(scope.$parent.model + ' = evalValue;');
          }
        });

        scope.$parent.$parent.$watch(scope.$parent.model, function(value) {
          if (value !== undefined) {
            scope.value = value;
          }
        });

        scope.setValue = function(value) {
          scope.value = value;
        };

        scope.getValue = function() {
          return scope.value;
        };

        var validators = scope.$parent.field.validators;

        for (var key in validators) {

          var directive = key;

          if (angularDirectives.indexOf(key) !== -1) {
            directive = 'ng-' + key;
          }

          var condition = validators[key][0];

          if (typeof condition === 'string') {
            condition = condition.replace(/^\$/, '$parent.$parent.');
          }

          elem.attr(directive, condition);
        }

        var name = scope.field.getName();

        elem.attr('ng-model', 'value');
        elem.attr('ng-change', 'field.errors = []');
        elem.attr('name', name);
        elem.removeAttr('i-model');
        $compile(elem)(scope);

        if (scope.$parent.iForm) {
          var ngModel = scope.$parent.iForm.form[name];

          if (ngModel) {
            scope.field.ngModel = ngModel;
          }
        }
      }
    };
  });

