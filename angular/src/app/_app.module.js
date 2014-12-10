'use strict';

angular
  .module('openpiApp', [
    'ngLocale',
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.router',
    'googlechart',
    'openpiApp.user',
    'openpiApp.knowledgeTests',
  ])
  .config(function($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  });
