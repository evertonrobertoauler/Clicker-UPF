'use strict';

angular
  .module('openpiApp.knowledgeTests')
  .controller('KnowledgeTestsController', function($scope, $stateParams, $state, KnowledgeTests) {

    var $ngRepeat = $scope.$parent.$parent;

    if ($ngRepeat.obj) {
      $ngRepeat.$parent.$watch('list[\'' + $ngRepeat.obj._id + '\']', function() {
        $scope.updateKt($ngRepeat.obj);
      }, true);
    } else if ($stateParams._id) {
      $scope.kt = KnowledgeTests.get({id: $stateParams._id});

      $scope.kt.$promise.then(function(kt) {
        kt.start = moment(kt.start).toDate();
        kt.end = moment(kt.end).toDate();

        if ($state.current.name === 'knowledge-tests.detail') {
          $scope.populateAnswersChart($scope.kt);
          $scope.populateCorrectAnswerChart($scope.kt);
        }
      });
    } else {
      $scope.kt = new KnowledgeTests();
      $scope.kt.start = moment().toDate();
      $scope.kt.end = moment().add(5, 'minutes').toDate();
    }

    $scope.updateKt = function(kt) {
      $scope.$applyAsync(function() {
        $scope.kt = kt;
        $scope.kt.start = moment($scope.kt.start).toDate();
        $scope.kt.end = moment($scope.kt.end).toDate();
        $scope.populateAnswersChart($scope.kt);
        $scope.populateCorrectAnswerChart($scope.kt);
      });
    };

    $scope.add = function(minutes){
      var now = new Date();
      var end = $scope.kt.end > now && minutes > 0 ? $scope.kt.end : now;

      $scope.kt.end = new Date(end.getTime() + minutes * 60000);
      $scope.save();
    };

    $scope.save = function() {

      var error = function(e) {
        $scope.iForm.setErrors(e.data);
      };

      var success = function(kt) {
        if ($state.current.name.indexOf('knowledge-tests') !== -1) {
          $state.transitionTo('knowledge-tests.detail', kt);
        }
      };

      if (!$scope.kt._id) {
        KnowledgeTests.insert($scope.kt, success, error);
      } else {
        var kt = angular.copy($scope.kt);
        kt.classroom = kt.classroom._id;
        kt.question = kt.question._id;
        KnowledgeTests.update(kt, success, error);
      }
    };


    $scope.populateAnswersChart = function(kt) {

      var rows = (kt.question.answers || []).map(function(a) {
        return {c: [
          {v: a},
          {v: 0}
        ]};
      });

      kt.students = kt.answers;
      kt.filteredAnswers = kt.answers.filter(function(a){ return a.answer !== undefined; });
      kt.filteredAnswers.forEach(function(a){ rows[a.answer].c[1].v += 1; });

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

      for (var i in kt.filteredAnswers) {
        var a = (kt.filteredAnswers[i].answer === kt.question.rightAnswer ? 0 : 1);
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
  });
