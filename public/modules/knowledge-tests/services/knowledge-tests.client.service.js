'use strict';

//Knowledge tests service used to communicate Knowledge tests REST endpoints
angular.module('knowledge-tests')
  .factory('KnowledgeTests', function($resource) {
    return $resource('knowledge-tests/:id', {
      id: '@_id'
    }, {
      update: {method: 'PUT'},
      query: {method: 'GET'},
    });
  });