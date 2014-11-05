'use strict';

angular.module('openpiApp')
  .controller('IdeaCtrl', function($scope, $cookies, Auth) {

    $scope.Auth = Auth;

    Auth.auth = $cookies.auth && JSON.parse($cookies.auth);
    Auth.user = $cookies.user && JSON.parse($cookies.user);

    $scope.updateMenu = function() {
      $scope.nav = {
        title: 'Open Peer Instruction',
        href: '/',
        user: Auth.user,
        left: [
          {type: 'link', title: 'Início', state: 'main', role: 'user'},
          {type: 'link', title: 'Turmas', state: 'classrooms.list', role: 'professor'},
          {type: 'link', title: 'Perguntas', state: 'questions.list', role: 'professor'},
          {type: 'link', title: 'Avaliações', state: 'knowledge-tests.list', role: 'professor'},
        ],
        right: [
          {type: 'link', title: $scope.getUserName(), state: 'profile', role: 'user'},
          {type: 'link', title: 'Logout', state: 'logout', role: 'user'},
          {type: 'link', title: 'Cadastre-se', state: 'signup'},
          {type: 'link', title: 'Login', state: 'login'}
        ],
      };
    };

    $scope.getUserName = function() {
      if (Auth.user) {
        return Auth.user.first_name + ' ' + Auth.user.last_name;
      }
    };

    if (Auth.auth) {
      Auth.saveToken(Auth.auth);
      Auth.getUserData(true);
    }

    var saveCookie = function(field) {
      if ($scope.Auth[field]) {
        $cookies[field] = JSON.stringify($scope.Auth[field]);
      } else {
        delete $cookies[field];
      }
    };

    $scope.$watch('Auth', function() {
      $scope.updateMenu();
      saveCookie('auth');
      saveCookie('user');
    }, true);

  });
