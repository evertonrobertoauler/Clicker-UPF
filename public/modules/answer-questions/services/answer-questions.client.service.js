'use strict';

angular.module('answer-questions').factory('AnswerQuestions', ['$resource',
  function($resource) {
    return $resource(
      '/answer/questions/:testId',
      {testId: '@_id'},
      {update: {method: 'PUT'}}
    );
  }
]);
