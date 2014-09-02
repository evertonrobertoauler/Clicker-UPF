'use strict';

// Knowledge tests controller
angular.module('knowledge-tests').controller('KnowledgeTestsController', [
  '$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'KnowledgeTests', 'Classrooms', 'Questions',
  function($scope, $stateParams, $location, $timeout, Authentication, KnowledgeTests, Classrooms, Questions) {
    $scope.authentication = Authentication;

    $scope.KnowledgeTests = KnowledgeTests;

    $scope.config = [
      {
        label: 'Início',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'start',
        filter: {date : 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Término',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'end',
        filter: {date : 'dd/MM/yyyy HH:mm'}
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

    // Create new Knowledge test
    $scope.create = function() {

      var period = $scope.getPeriodDate();

      // Create new Knowledge test object
      var knowledgeTest = new KnowledgeTests({
        question: this.question._id,
        classroom: this.classroom._id,
        start: period[0],
        end: period[1]
      });

      // Redirect after save
      knowledgeTest.$save(function(response) {
        $location.path('knowledge-tests/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Update existing Knowledge test
    $scope.update = function() {
      var knowledgeTest = $scope.knowledgeTest;

      var period = $scope.getPeriodDate();
      knowledgeTest.start = period[0];
      knowledgeTest.end = period[1];

      knowledgeTest.$update(function() {
        $location.path('knowledge-tests/' + knowledgeTest._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Knowledge tests
    $scope.find = function() {
      $scope.knowledgeTests = KnowledgeTests.query();
    };

    // Find existing Knowledge test
    $scope.findOne = function(callback) {
      KnowledgeTests.get({
        id: $stateParams.knowledgeTestId
      }).$promise.then(function(kt) {
          if (JSON.stringify($scope.knowledgeTest) !== JSON.stringify(kt)) {

            $scope.knowledgeTest = kt;

            if (callback) {
              callback(kt);
            }
          }
        });
    };

    $scope.loadOptions = function() {
      $scope.classrooms = Classrooms.query();
      $scope.questions = Questions.query();
    };

    $scope.openDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.today = new Date();
    $scope.startDate = new Date();
    $scope.startTime = new Date();
    $scope.testTime = moment('00:05', 'h:mm').toDate();

    $scope.getPeriodDate = function() {

      var start = moment(
          ($scope.startDate || new Date()).toISOString().substr(0, 11) +
          ($scope.startTime || new Date()).toISOString().substr(11, 5) + ':00'
      ).subtract('hours', 3).toDate();

      var end = moment(start).add('hours', $scope.testTime.getHours())
        .add('minutes', $scope.testTime.getMinutes())
        .toDate();

      return [start, end];
    };

    $scope.findOneEdit = function() {
      $scope.findOne(function(k) {
        $scope.startDate = new Date(k.start);
        $scope.startTime = new Date(k.start);

        $scope.testTime = moment('00:00', 'h:mm')
          .add('minutes', moment(k.end).diff(moment(k.start), 'minutes'))
          .toDate();
      });
    };

    $scope.findOneView = function() {
      if (/^\/knowledge-tests\/[^/]+$/.test($location.path())) {
        $timeout($scope.findOneView, 5000);
        $scope.findOne(function(kt) {
          $scope.populateAnswersChart(kt);
          $scope.populateCorrectAnswerChart(kt);
        });
      }
    };

    $scope.populateAnswersChart = function(kt) {

      var rows = (kt.question.answers || []).map(function(a) {
        return {c: [
          {v: a},
          {v: 0}
        ]};
      });

      for (var i in kt.answers) {
        var a = kt.answers[i].answer;
        rows[a].c[1].v += 1;
      }

      $scope.answersChart = {
        type: 'PieChart',
        options: {title: 'Gráfico de respostas', is3D: true},
        data: {
          'cols': [
            {id: 't', label: 'Topping', type: 'string'},
            {id: 's', label: 'Slices', type: 'number'}
          ],
          'rows': rows
        }
      };
    };

    $scope.populateCorrectAnswerChart = function(kt) {

      var rows = [
        {c: [
          {v: 'Correto'},
          {v: 0}
        ]},
        {c: [
          {v: 'Errado'},
          {v: 0}
        ]},
      ];

      for (var i in kt.answers) {
        var a = (kt.answers[i].answer === kt.question.rightAnswer ? 0 : 1);
        rows[a].c[1].v += 1;
      }

      $scope.correctAnswerChart = {
        type: 'PieChart',
        options: {title: 'Gráfico de acertos', is3D: true},
        data: {
          'cols': [
            {id: 't', label: 'Topping', type: 'string'},
            {id: 's', label: 'Slices', type: 'number'}
          ],
          'rows': rows
        }
      };
    };
  }
]);