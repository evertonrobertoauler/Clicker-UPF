'use strict';

angular
  .module('openpiApp.questions', ['openpiApp.main'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('questions', {
        abstract: true,
        url: '/questions',
        template: '<ui-view/>',
      })
      .state('questions.list', {
        url: '',
        controller: 'QuestionsController',
        templateUrl: 'app/questions/questions.list.html',
      })
      .state('questions.edit', {
        url: '/form/:_id',
        controller: 'QuestionsController',
        templateUrl: 'app/questions/questions.form.html',
      })
      .state('questions.create', {
        url: '/form',
        controller: 'QuestionsController',
        templateUrl: 'app/questions/questions.form.html',
      })
      .state('questions.detail', {
        url: '/:_id',
        controller: 'QuestionsController',
        templateUrl: 'app/questions/questions.detail.html',
      });
  });
