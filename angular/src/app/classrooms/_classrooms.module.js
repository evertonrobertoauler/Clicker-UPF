'use strict';

angular
  .module('openpiApp.classrooms', [
    'ngResource',
    'ui.router',
    'idea',
    'openpiApp.main',
  ])
  .config(function ($stateProvider) {
    $stateProvider
      .state('classrooms', {
        abstract: true,
        url: '/classrooms',
        template: '<ui-view/>',
      })
      .state('classrooms.list', {
        url: '',
        controller: 'ClassroomsController',
        templateUrl: 'app/classrooms/classrooms.list.html',
      })
      .state('classrooms.edit', {
        url: '/form/:_id',
        controller: 'ClassroomsController',
        templateUrl: 'app/classrooms/classrooms.form.html',
      })
      .state('classrooms.create', {
        url: '/form',
        controller: 'ClassroomsController',
        templateUrl: 'app/classrooms/classrooms.form.html',
      })
      .state('classrooms.detail', {
        url: '/:_id',
        controller: 'ClassroomsController',
        templateUrl: 'app/classrooms/classrooms.detail.html',
      });
  });
