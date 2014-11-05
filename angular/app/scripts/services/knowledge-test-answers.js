'use strict';

angular.module('openpiApp')
  .factory('KnowledgeTestAnswers', function($resource, API_URL) {
    return $resource(API_URL + 'knowledge/test/answers/:id/', {id: '@id'}, {
      query: {method: 'GET'},
      update: {method: 'PUT'},
    });
  });
