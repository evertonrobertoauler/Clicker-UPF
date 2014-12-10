'use strict';

angular.module('openpiApp.knowledgeTests')
  .factory('KnowledgeTests', function($resource, API_URL) {
    var KnowledgeTests = $resource(API_URL + 'professor/knowledge/tests/:id/', {id: '@_id'}, {
      query: {method: 'GET'},
      insert: {method: 'POST'},
      update: {method: 'PATCH'},
    });

    KnowledgeTests.columns = [
      {
        label: 'Número',
        classes: 'col-xs-2 col-sm-2 col-md-1 col-lg-1 text-center',
        field: 'number',
      },
      {
        label: 'Início',
        classes: 'col-xs-3 col-sm-3 col-md-2 col-lg-2 text-center',
        field: 'start',
        filter: {date: 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Término',
        classes: 'col-xs-3 col-sm-3 col-md-2 col-lg-2 text-center',
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
        classes: 'col-xs-12 col-sm-12 col-md-5 col-lg-5',
        field: 'question.text',
      },
    ];

    return KnowledgeTests;
  });
