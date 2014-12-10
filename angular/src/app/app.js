'use strict';

angular
  .module('openpiApp', [
    'ngLocale',
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'googlechart',
    'openpiApp.main',
    'openpiApp.user',
    'idea',
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('classrooms', {
        abstract: true,
        url: '/classrooms',
        template: '<ui-view/>',
      })
      .state('classrooms.list', {
        url: '',
        controller: 'ClassroomsCtrl',
        templateUrl: 'app/views/classrooms/list.html',
      })
      .state('classrooms.edit', {
        url: '/form/:_id',
        controller: 'ClassroomsCtrl',
        templateUrl: 'app/views/classrooms/form.html',
      })
      .state('classrooms.create', {
        url: '/form',
        controller: 'ClassroomsCtrl',
        templateUrl: 'app/views/classrooms/form.html',
      })
      .state('classrooms.detail', {
        url: '/:_id',
        controller: 'ClassroomsCtrl',
        templateUrl: 'app/views/classrooms/detail.html',
      })
      .state('questions', {
        abstract: true,
        url: '/questions',
        template: '<ui-view/>',
      })
      .state('questions.list', {
        url: '',
        controller: 'QuestionsCtrl',
        templateUrl: 'app/views/questions/list.html',
      })
      .state('questions.edit', {
        url: '/form/:_id',
        controller: 'QuestionsCtrl',
        templateUrl: 'app/views/questions/form.html',
      })
      .state('questions.create', {
        url: '/form',
        controller: 'QuestionsCtrl',
        templateUrl: 'app/views/questions/form.html',
      })
      .state('questions.detail', {
        url: '/:_id',
        controller: 'QuestionsCtrl',
        templateUrl: 'app/views/questions/detail.html',
      })
      .state('knowledge-tests', {
        abstract: true,
        url: '/knowledge/tests',
        template: '<ui-view/>',
      })
      .state('knowledge-tests.list', {
        url: '',
        controller: 'KnowledgeTestsCtrl',
        templateUrl: 'app/views/knowledge-tests/list.html',
      })
      .state('knowledge-tests.edit', {
        url: '/form/:_id',
        controller: 'KnowledgeTestsCtrl',
        templateUrl: 'app/views/knowledge-tests/edit.html',
      })
      .state('knowledge-tests.create', {
        url: '/form',
        controller: 'KnowledgeTestsCtrl',
        templateUrl: 'app/views/knowledge-tests/create.html',
      })
      .state('knowledge-tests.detail', {
        url: '/:_id',
        templateUrl: 'app/views/knowledge-tests/detail.html',
      });
  });
