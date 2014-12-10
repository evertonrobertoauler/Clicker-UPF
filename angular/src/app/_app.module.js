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
  });
