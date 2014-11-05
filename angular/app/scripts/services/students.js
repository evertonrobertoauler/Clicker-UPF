'use strict';

angular.module('openpiApp')
  .factory('Students', function($resource, API_URL) {
    var Students = $resource(API_URL + 'students/:id/', {id: '@id'}, {
      query: {method: 'GET'},
    });

    Students.toString = function(student) {
      return student.full_name || student.email;
    };

    return Students;
  });