'use strict';

angular.module('questions').config(function($stateProvider) {
  $stateProvider.
    state('listQuestions', {
      url: '/questions',
      templateUrl: 'modules/questions/views/list-questions.client.view.html'
    }).
    state('createQuestion', {
      url: '/questions/create',
      templateUrl: 'modules/questions/views/create-question.client.view.html'
    }).
    state('viewQuestion', {
      url: '/questions/:questionId',
      templateUrl: 'modules/questions/views/view-question.client.view.html'
    }).
    state('editQuestion', {
      url: '/questions/edit/:questionId',
      templateUrl: 'modules/questions/views/edit-question.client.view.html'
    });
});