'use strict';

angular.module('idea').filter('iFromCharCode', function() {
  return function(code) {
    return String.fromCharCode(code);
  };
});
