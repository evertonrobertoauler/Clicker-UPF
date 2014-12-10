(function () {
  'use strict';

  angular
    .module('openpiApp')
    .controller('AppController', AppController);

  /** @ngInject */
  function AppController($scope, Auth) {

    $scope.user = {};

    $scope.updateMenu = function () {

      $scope.user = Auth.getUser();

      $scope.nav = {
        title: 'Open Peer Instruction',
        href: '/#/',
        user: $scope.user,
        left: [
          {type: 'link', title: 'Início', state: 'main', role: 'user'},
          {type: 'link', title: 'Turmas', state: 'classrooms.list', role: 'professor'},
          {type: 'link', title: 'Perguntas', state: 'questions.list', role: 'professor'},
          {type: 'link', title: 'Avaliações', state: 'knowledge-tests.list', role: 'professor'},
        ],
        right: [
          {type: 'link', title: Auth.getUserName(), state: 'profile', role: 'user'},
          {type: 'link', title: 'Logout', state: 'logout', role: 'user'},
          {type: 'link', title: 'Cadastre-se', state: 'signup'},
          {type: 'link', title: 'Login', state: 'login'}
        ],
      };
    };

    $scope.updateMenu();
  }
})();
