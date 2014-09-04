'use strict';

//Setting up route
angular.module('classrooms').config(function($stateProvider) {
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
      url: '/classrooms/edit/:classroomId',
      templateUrl: 'modules/classrooms/views/edit-classroom.client.view.html'
    });
});
