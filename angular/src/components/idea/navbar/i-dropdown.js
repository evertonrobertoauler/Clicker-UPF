'use strict';

angular.module('idea').directive('iDropdown', function () {
  return {
    restrict: 'A',
    link: function postLink(scope, element) {

      var handler = function () {
        if (element.is(':focus') && !element.parent().attr('class').match(/open/)) {
          element.dropdown('toggle');
        }
      };

      element.parent().on('hidden.bs.dropdown', handler);
      element.on('keypress', handler);

      element.on('blur', function () {
        setTimeout(function () {
          if (element.parent().attr('class').match(/open/)) {
            element.dropdown('toggle');
          }
        }, 500);
      });
    }
  };
});
