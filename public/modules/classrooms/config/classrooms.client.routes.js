'use strict';

//Setting up route
angular.module('classrooms').config(['$stateProvider',
  function($stateProvider) {
    // Classrooms state routing
    $stateProvider.
    state('listClassrooms', {
      url: '/classrooms',
      templateUrl: 'modules/classrooms/views/list-classrooms.client.view.html'
    }).
    state('createClassroom', {
      url: '/classrooms/create',
      templateUrl: 'modules/classrooms/views/create-classroom.client.view.html'
    }).
    state('viewClassroom', {
      url: '/classrooms/:classroomId',
      templateUrl: 'modules/classrooms/views/view-classroom.client.view.html'
    }).
    state('editClassroom', {
      url: '/classrooms/:classroomId/edit',
      templateUrl: 'modules/classrooms/views/edit-classroom.client.view.html'
    });
  }
]);
