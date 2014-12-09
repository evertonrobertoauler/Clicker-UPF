'use strict';

angular
  .module('openpiApp')
  .filter('iFromCharCode', function() {
    return function(code) {
      return String.fromCharCode(code);
    };
  });
