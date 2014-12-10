'use strict';

angular
  .module('openpiApp.main', ['ui.router'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html'
      });
  })
  .value('SOCKET_URL', 'http://127.0.0.1:3001/')
  .value('AUTH_URL', 'http://127.0.0.1:3000/auth/')
  .value('API_URL', 'http://127.0.0.1:3000/api/v1/');
