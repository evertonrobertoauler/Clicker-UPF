'use strict';

angular.module('answer-questions').controller('AnswerQuestionsController', [
  '$scope', '$timeout', '$location', 'AnswerQuestions',
  function($scope, $timeout, $location, AnswerQuestions) {

    $scope.success = {};
    $scope.countDown = {};
    $scope.answers = {};

    $scope.find = function() {
      if ($location.path() === '/') {
        $timeout($scope.find, 5000);
        AnswerQuestions.query(function(tests) {
          if (JSON.stringify($scope.answerQuestions) !== JSON.stringify(tests)) {
            $scope.answerQuestions = tests || [];
            $scope.answerQuestions.forEach($scope.setDefaults);
          }
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
  }
]);