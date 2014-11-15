'use strict';

angular.module('openpiApp')
  .factory('Students', function($resource, API_URL) {
    var Students = $resource(API_URL + 'professor/students/:id/', {id: '@_id'}, {
      query: {method: 'GET'},
    });

    Students.toString = function(student) {
      if (student) {
        return student.displayName || student.email;
      }
    };

    return Students;
  });