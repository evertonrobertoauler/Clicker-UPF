'use strict';

angular.module('idea')
  .directive('iFormField', function() {

    var defaultMsgs = {
      required: 'Campo Obrigatório!',
    };

    return {
      templateUrl: '/modules/idea/views/directives/iformfields/base.html',
      restrict: 'E',
      transclude: true,
      scope: {
        model: '@',
        options: '=options',
        validation: '=validators',
        type: '@',
        name: '@',
        label: '@',
        placeholder: '@'
      },
      link: function postLink(scope) {
        scope.iForm = scope.$parent.iForm;
        scope.validators = angular.copy(scope.validation) || {};

        scope.isArray = Array.isArray(scope.options);

        for (var i in scope.validators) {
          var condition = scope.validators[i];

          if (!Array.isArray(condition)) {
            scope.validators[i] = [condition, defaultMsgs[i]];
          }
        }

        scope.getName = function() {
          return scope.name || scope.model;
        };
      }
    };
  });
