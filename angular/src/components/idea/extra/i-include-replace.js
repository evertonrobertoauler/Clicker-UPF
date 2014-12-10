'use strict';

angular.module('idea').directive('iIncludeReplace', function () {
  return {
    require: 'ngInclude',
    restrict: 'A',
    link: function postLink(scope, el) {
      el.replaceWith(el.children());
    }
  };
});
