'use strict';

angular.module('openpiApp').directive('iIncludeReplace', function () {
  return {
    require: 'ngInclude',
    restrict: 'A',
    link: function postLink(scope, el) {
      el.replaceWith(el.children());
    }
  };
});
