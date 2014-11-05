'use strict';

angular.module('openpiApp')
  .factory('Questions', function($resource, API_URL) {
    var Questions = $resource(API_URL + 'questions/:id/', {id: '@id'}, {
      query: {method: 'GET'},
      insert: {method: 'POST'},
      update: {method: 'PUT'},
    });

    Questions.columns = [
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

    Questions.filters = {};

    Questions.toString = function(question) {
      return question.text.substr(0, 50);
    };

    return Questions;
  });
