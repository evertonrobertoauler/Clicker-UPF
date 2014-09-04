'use strict';

//Classrooms service used to communicate Classrooms REST endpoints
angular.module('classrooms')
  .factory('Classrooms', function($resource) {
    return $resource('classrooms/:id', {
      id: '@_id'
    }, {
      update: {method: 'PUT'},
      query: {method: 'GET'},
    });
  });
