'use strict';

angular.module('openpiApp')
  .factory('KnowledgeTests', function($resource, API_URL) {
    var KnowledgeTests = $resource(API_URL + 'knowledge/tests/:id/', {id: '@id'}, {
      query: {method: 'GET'},
      insert: {method: 'POST'},
      update: {method: 'PUT'},
    });

    KnowledgeTests.columns = [
      {
        label: 'Início',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'start',
        filter: {date: 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Término',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'end',
        filter: {date: 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Turma',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2',
        field: 'classroom.name',
      },
      {
        label: 'Pergunta',
        classes: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
        field: 'question.text',
      },
    ];

    return KnowledgeTests;
  });
