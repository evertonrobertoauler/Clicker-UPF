'use strict';

angular
  .module('openpiApp', [
    'ngLocale',
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ngResource',
    'ngCookies',
    'ui.bootstrap',
    'ui.router',
    'googlechart',
    'idea',
    'openpiApp.main',
    'openpiApp.user',
    'openpiApp.knowledgeTests',
  ])
  .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  })
  .value('SOCKET_URL', 'http://127.0.0.1:3001/')
  .value('AUTH_URL', 'http://127.0.0.1:3000/auth/')
  .value('API_URL', 'http://127.0.0.1:3000/api/v1/');
