'use strict';

//Setting up route
angular.module('knowledge-tests').config(['$stateProvider',
  function($stateProvider) {
    // Knowledge tests state routing
    $stateProvider
      .state('listKnowledgeTests', {
        url: '/knowledge-tests',
        templateUrl: 'modules/knowledge-tests/views/list-knowledge-tests.client.view.html'
      })
      .state('createKnowledgeTest', {
        url: '/knowledge-tests/create',
        templateUrl: 'modules/knowledge-tests/views/create-knowledge-test.client.view.html'
      })
      .state('viewKnowledgeTest', {
        url: '/knowledge-tests/:knowledgeTestId',
        templateUrl: 'modules/knowledge-tests/views/view-knowledge-test.client.view.html'
      })
      .state('editKnowledgeTest', {
        url: '/knowledge-tests/:knowledgeTestId/edit',
        templateUrl: 'modules/knowledge-tests/views/edit-knowledge-test.client.view.html'
      });
  }
]);