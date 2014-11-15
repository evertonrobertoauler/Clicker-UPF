'use strict';

angular.module('openpiApp')
  .factory('Classrooms', function($resource, API_URL) {
    var Classrooms = $resource(API_URL + 'professor/classrooms/:id/', {id: '@_id'}, {
      query: {method: 'GET'},
      insert: {method: 'POST'},
      update: {method: 'PUT'},
    });

    Classrooms.columns = [
      {
        label: 'Criação',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'created',
        filter: {date: 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Nome',
        classes: 'col-xs-8 col-sm-8 col-md-10 col-lg-10',
        field: 'name',
      },
    ];

    Classrooms.toString = function(classroom) {
      return classroom.name;
    };

    return Classrooms;
  });
