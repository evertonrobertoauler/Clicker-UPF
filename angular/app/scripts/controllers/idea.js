'use strict';

angular.module('openpiApp')
  .controller('IdeaCtrl', function($scope, Auth, Socket) {

    Socket.on('this', function (data) {
      console.log(data);
      Socket.emit('private message', { my: 'data' });
    });

    $scope.updateMenu = function() {

      $scope.nav = {
        title: 'Open Peer Instruction',
        href: '/',
        user: Auth.getUser(),
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
  });
