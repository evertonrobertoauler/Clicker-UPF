'use strict';

angular
  .module('openpiApp')
  .controller('KnowledgeTestsCtrl', function($scope, $stateParams, $state, $timeout, $interval, KnowledgeTests) {

    var $ngRepeat = $scope.$parent.$parent;

    if ($ngRepeat.obj) {
      $ngRepeat.$parent.$watch('list[\'' + $ngRepeat.obj._id + '\']', function() {
        $scope.updateKt($ngRepeat.obj);
      }, true);
    } else if ($stateParams._id) {
      $scope.kt = KnowledgeTests.get({id: $stateParams._id});

      $scope.kt.$promise.then(function(kt) {
        kt.start = new Date(kt.start);
        kt.end = new Date(kt.end);

        if ($state.current.name === 'knowledge-tests.detail') {
          $scope.populateAnswersChart($scope.kt);
          $scope.populateCorrectAnswerChart($scope.kt);

          var interval = $interval(function() {
            KnowledgeTests.get({id: $stateParams._id}).$promise.then($scope.updateKt);
          }, 5000);

          $scope.$on('$stateChangeStart', function() {
            $interval.cancel(interval);
          });
        }
      });
    } else {
      $scope.kt = new KnowledgeTests();
      $scope.kt.start = new Date();

      var end = new Date();
      end.setMinutes(end.getMinutes() + 5);
      $scope.kt.end = end;
    }

    $scope.updateKt = function(kt) {
      $timeout(function() {
        $scope.kt = kt;
        $scope.kt.start = new Date($scope.kt.start);
        $scope.kt.end = new Date($scope.kt.end);
        $scope.populateAnswersChart($scope.kt);
        $scope.populateCorrectAnswerChart($scope.kt);
      }, 1);
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
  });