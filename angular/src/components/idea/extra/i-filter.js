(function () {
  'use strict';

  angular
    .module('idea')
    .filter('iFilter', iFilter);

  /** @ngInject */
  function iFilter($filter) {
    return function (obj, col) {
      var value;

      if (Array.isArray(col.field)) {
        value = col.field.map(function (f) {
          return obj[f];
        });
      } else {
        value = obj[col.field];
      }

      for (var i in col.filter) {

        if (i === 'date' && value) {
          value = new Date(value);
        }

        value = $filter(i)(value, col.filter[i]);
      }

      return value;
    };
  }
})();
