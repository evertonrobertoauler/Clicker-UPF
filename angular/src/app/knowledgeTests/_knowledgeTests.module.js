(function () {
  'use strict';

  angular
    .module('openpiApp.knowledgeTests', [
      'openpiApp.classrooms',
      'openpiApp.questions',
    ])
    .config(stateConfig);

  /** @ngInject */
  function stateConfig($stateProvider) {
    $stateProvider
      .state('knowledge-tests', {
        abstract: true,
        url: '/knowledge/tests',
        template: '<ui-view/>',
      })
      .state('knowledge-tests.list', {
        url: '',
        controller: 'KnowledgeTestsController',
        templateUrl: 'app/knowledgeTests/knowledgeTests.list.html',
      })
      .state('knowledge-tests.edit', {
        url: '/form/:_id',
        controller: 'KnowledgeTestsController',
        templateUrl: 'app/knowledgeTests/knowledgeTests.edit.html',
      })
      .state('knowledge-tests.create', {
        url: '/form',
        controller: 'KnowledgeTestsController',
        templateUrl: 'app/knowledgeTests/knowledgeTests.create.html',
      })
      .state('knowledge-tests.detail', {
        url: '/:_id',
        templateUrl: 'app/knowledgeTests/knowledgeTests.detail.html',
      });
  }
})();
