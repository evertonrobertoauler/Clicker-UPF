(function () {
  'use strict';

  angular
    .module('idea')
    .filter('iFromCharCode', iFromCharCode);

  /** @ngInject */
  function iFromCharCode() {
    return function (code) {
      return String.fromCharCode(code);
    };
  }
})();
