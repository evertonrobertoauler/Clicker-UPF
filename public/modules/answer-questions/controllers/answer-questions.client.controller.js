'use strict';

angular.module('answer-questions').controller('AnswerQuestionsController', [
  '$scope', '$interval', '$timeout', '$location', 'AnswerQuestions',
  function($scope, $interval, $timeout, $location, AnswerQuestions) {

    $scope.success = {};
    $scope.countDown = {};
    $scope.answers = {};

    $scope.find = function() {
      if ($location.path() !== '/') {
        $interval.cancel($scope.findInterval);
      } else {
        AnswerQuestions.query(function(tests) {
          $scope.answerQuestions = tests || [];
          $scope.answerQuestions.forEach($scope.setDefaults);
        });
      }
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
      if (typeof $scope.answers[test._id] === 'undefined') {
        $scope.answers[test._id] = test.answers[0] && test.answers[0].answer;
      }
    };

    $scope.findInterval = $interval($scope.find, 5000);
  }
]);