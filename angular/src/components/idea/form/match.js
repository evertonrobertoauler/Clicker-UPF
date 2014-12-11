(function () {
  'use strict';

  angular
    .module('idea')
    .directive('match', match);

  /** @ngInject */
  function match() {
    return {
      require: '?ngModel',
      link: matchLink
    };
  }

  function matchLink(scope, element, attrs, ctrl) {
    if (ctrl) {
      var validator = function (value) {
        var match = scope.$eval(attrs.match) === value;
        ctrl.$setValidity('match', match);
        return value;
      };

      ctrl.$formatters.push(validator);
      ctrl.$parsers.unshift(validator);

      attrs.$observe('match', function () {
        validator(ctrl.$viewValue);
      });

      scope.$watch(attrs.match, function () {
        validator(ctrl.$viewValue);
      });
    }
  }
})();
