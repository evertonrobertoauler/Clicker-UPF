'use strict';

angular.module('answer-questions').controller('AnswerQuestionsController', [
  '$scope', '$interval', '$timeout', 'AnswerQuestions',
  function($scope, $interval, $timeout, AnswerQuestions) {

    $scope.success = {};
    $scope.countDown = {};
    $scope.intervals = [];
    $scope.answers = {};

    $scope.find = function() {
      AnswerQuestions.query(function(tests) {
        $scope.answerQuestions = tests || [];

        $scope.intervals.splice(0).forEach($interval.cancel);

        $scope.answerQuestions.forEach($scope.setDefaults);
      });
    };

    $scope.update = function(id) {
      new AnswerQuestions({
        _id: id,
        answer: $scope.answers[id]
      }).$update(function(msg) {
          $scope.success[id] = msg.success;

          $timeout(function() {
            $scope.success[id] = '';
          }, 3000);

        }, function(error) {
          $scope.error = error.data.error;
          $scope.find();
        });
    };

    $scope.setDefaults = function(test) {

      if (!$scope.answers[test._id]) {
        $scope.answers[test._id] = test.answers[0] && test.answers[0].answer;
      }

      test.end = moment(test.end).subtract('hours', 3).toDate();

      $scope.intervals.push($interval(function() {
        $scope.countDown[test._id] = test.end;
      }, 1000));
    };

    $interval($scope.find, 5000);
  }
]);