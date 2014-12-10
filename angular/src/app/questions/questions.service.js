(function () {
  'use strict';

  angular
    .module('openpiApp.questions')
    .factory('Questions', Questions);

  /** @ngInject */
  function Questions($resource, API_URL) {
    var service = $resource(API_URL + 'professor/questions/:id/', {id: '@_id'}, {
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
        label: 'Pergunta',
        classes: 'col-xs-8 col-sm-8 col-md-10 col-lg-10',
        field: 'text',
      },
    ];

    service.filters = {};

    service.toString = function (question) {
      return question.text.substr(0, 50);
    };

    return service;
  }
})();
