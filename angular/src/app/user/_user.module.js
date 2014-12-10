'use strict';

angular
  .module('openpiApp.user', [
    'ngResource',
    'ngCookies',
    'ui.router',
    'idea',
    'openpiApp.main',
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/user/auth.html',
        controller: 'AuthController'
      })
      .state('logout', {
        url: '/logout',
        controller: function ($scope, Auth) {
          Auth.logout();
          $scope.updateMenu();
        }
      })
      .state('token', {
        url: '/token/:refresh',
        controller: 'AuthController'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/user/signup.html',
        controller: 'SignupController'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'ProfileController',
      });
  })
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
