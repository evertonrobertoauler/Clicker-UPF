'use strict';

angular.module('idea')
  .directive('iValidators', function($compile, $parse) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        if (elem.attr('i-validators')) {
          var validators = $parse(elem.attr('i-validators'))(scope);
          elem.removeAttr('i-validators');

          var angularDirectives = [
            'required', 'minlength', 'maxlength', 'pattern'
          ];

          for (var key in validators) {

            var directive = key;

            if (angularDirectives.indexOf(key) !== -1) {
              directive = 'ng-' + key;
            }

            if (Array.isArray(validators[key])) {
              elem.attr(directive, validators[key][0]);
            } else {
              elem.attr(directive, validators[key]);
            }
          }

          $compile(elem)(scope);
        }
      }
    };
  });
