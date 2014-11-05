'use strict';

angular
  .module('openpiApp')
  .directive('match', function() {
    return {
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {
        if (ctrl) {
          var validator = function(value) {
            var match = scope.$eval(attrs.match) === value;
            ctrl.$setValidity('match', match);
            return value;
          };

          ctrl.$formatters.push(validator);
          ctrl.$parsers.unshift(validator);

          attrs.$observe('match', function() {
            validator(ctrl.$viewValue);
          });

          scope.$watch(attrs.match, function() {
            validator(ctrl.$viewValue);
          });
        }
      }
    };
  });
