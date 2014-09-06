'use strict';

//Questions service used to communicate Questions REST endpoints
angular.module('questions').factory('Questions', function($resource) {
  return $resource('questions/:id', { id: '@_id'}, {
    update: {method: 'PUT'},
    query: {method: 'GET'},
  });
});