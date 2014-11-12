'use strict';

angular.module('openpiApp')
  .factory('User', function($resource, API_URL) {
    return $resource(API_URL + 'users/:id', {id: '@_id'}, {
      query: {method: 'GET'}
    });
  });
