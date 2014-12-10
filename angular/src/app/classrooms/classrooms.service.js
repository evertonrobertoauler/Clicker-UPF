(function () {
  'use strict';

  angular
    .module('openpiApp.classrooms')
    .factory('Classrooms', Classrooms);

  /** @ngInject */
  function Classrooms($resource, API_URL) {
    var service = $resource(API_URL + 'professor/classrooms/:id/', {id: '@_id'}, {
      query: {method: 'GET'},
      insert: {method: 'POST'},
      update: {method: 'PUT'},
    });

    service.columns = [
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

    service.toString = function (classroom) {
      return classroom.name;
    };

    return service;
  }
})();
