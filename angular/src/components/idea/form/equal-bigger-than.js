'use strict';

angular
  .module('idea')
  .directive('equalBiggerThan', function() {
    return {
      require: '?ngModel',
      link: function (scope, element, attrs, ctrl) {

        scope = scope.$parent.$parent;

        if (ctrl) {
          var validator = function(value) {
            var equalBiggerThan = value >= scope.$eval(attrs.equalBiggerThan);
            ctrl.$setValidity('equal-bigger-than', equalBiggerThan);
            return value;
          };

          ctrl.$formatters.push(validator);
          ctrl.$parsers.unshift(validator);

          attrs.$observe('equalBiggerThan', function() {
            validator(ctrl.$viewValue);
          });

          scope.$watch(attrs.equalBiggerThan, function() {
            validator(ctrl.$viewValue);
          });
        }
      }
    };
  });
