'use strict';

angular
  .module('openpiApp', [
    'ngLocale',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'googlechart',
  ])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/views/login.html',
        controller: 'AuthCtrl'
      })
      .state('logout', {
        url: '/logout',
        controller: function($scope, Auth) {
          Auth.logout();
          $scope.updateMenu();
        }
      })
      .state('token', {
        url: '/token/:refresh',
        controller: 'AuthCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/views/profile.html',
        controller: 'ProfileCtrl',
      })
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
  })
  .value('SOCKET_URL', 'http://127.0.0.1:3001/')
  .value('AUTH_URL', 'http://127.0.0.1:3000/auth/')
  .value('API_URL', 'http://127.0.0.1:3000/api/v1/')
  .config(function($httpProvider) {

    $httpProvider.interceptors.push(function($q, $location, $cookieStore) {
      return {
        responseError: function(rejection) {
          switch (rejection.status) {
            case 401:
              var auth = $cookieStore.get('auth');

              if (auth && auth.token.refreshToken) {
                $location.path('/token/' + auth.token.refreshToken);
              } else {
                $cookieStore.remove('auth');
                $location.path('/login');
              }

              break;
          }

          return $q.reject(rejection);
        }
      };
    });
  });
