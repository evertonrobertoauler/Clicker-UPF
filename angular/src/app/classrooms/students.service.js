(function () {
  'use strict';

  angular
    .module('openpiApp.classrooms')
    .factory('Students', Students);

  /** @ngInject */
  function Students($resource, API_URL) {
    var service = $resource(API_URL + 'professor/students/:id/', {id: '@_id'}, {
      query: {method: 'GET'},
    });

    service.toString = function (student) {
      if (student) {
        return student.displayName || student.email;
      }
    };

    return service;
  }
})();
