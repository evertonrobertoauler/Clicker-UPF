'use strict';

angular
  .module('openpiApp')
  .directive('iFormField', function() {
    return {
      templateUrl: 'app/views/directives/i-form-fields/base.html',
      restrict: 'E',
      transclude: true,
      scope: {
        type: '@',
        model: '@',
        name: '@',
        validators: '@',
        label: '@',
        placeholder: '@',
        resource: '@',
        options: '@',
        optionsIsArray: '=',
        multi: '@',
      },
      link: function(scope, elem, attrs) {

        scope.iForm = scope.$parent.iForm;

        attrs.validators = attrs.validators && scope.$parent.$eval(attrs.validators) || {};
        attrs.multi = attrs.multi && scope.$parent.$eval(attrs.multi) || false;

        if (attrs.options) {
          scope.$parent.$watch(attrs.options + '', function(value){
            attrs.options = value;

            if (attrs.optionsIsArray === undefined) {
              attrs.optionsIsArray = Array.isArray(attrs.options);
            } else {
              attrs.optionsIsArray = JSON.parse(attrs.optionsIsArray);
            }
          }, true);
        }

        for (var i in attrs.validators) {
          var condition = attrs.validators[i];

          if (!Array.isArray(condition)) {
            attrs.validators[i] = [condition, 'Campo Obrigatório!'];
          }
        }

        attrs.getName = function() {
          return attrs.name || attrs.model;
        };

        scope.field = scope.$parent.iForm.fields[attrs.getName()] = attrs;
      }
    };
  });
