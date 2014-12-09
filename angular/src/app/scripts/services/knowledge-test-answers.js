'use strict';

angular.module('openpiApp')
  .factory('KnowledgeTestAnswers', function($resource, API_URL) {
    return $resource(API_URL + 'student/knowledge/tests/:_id/', {_id: '@_id'}, {
      query: {method: 'GET'},
      update: {method: 'PATCH'},
    });
  });
