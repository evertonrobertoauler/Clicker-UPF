'use strict';

// Setting up route
angular.module('core')
  .run(function(Menus) {
    Menus.addMenuItem('topbar', 'Turmas', 'classrooms', 'item', '/classrooms', null, ['professor']);
    Menus.addMenuItem('topbar', 'Perguntas', 'questions', 'item', '/questions', null, ['professor']);
    Menus.addMenuItem('topbar', 'Avaliações', 'knowledge-tests', 'item', '/knowledge-tests', null, ['professor']);
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  });
