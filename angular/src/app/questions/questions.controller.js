(function () {
  'use strict';

  angular
    .module('openpiApp')
    .controller('QuestionsController', QuestionsController);

  /** @ngInject */
  function QuestionsController($scope, $stateParams, $state, Questions) {

    if ($stateParams._id) {
      $scope.question = Questions.get({id: $stateParams._id});
    } else {
      $scope.question = new Questions();
    }

    $scope.save = function () {

      var error = function (e) {
        $scope.iForm.setErrors(e.data);

        if (e.data.detail) {
          $scope.error = e.data.detail;
        }
      };

      var success = function (q) {
        $state.transitionTo('questions.detail', q);
      };

      $scope.question.rightAnswer = parseInt($scope.question.rightAnswer);

      if (!$scope.question._id) {
        $scope.question.$insert(success, error);
      } else {
        $scope.question.$update(success, error);
      }
    };

    $scope.$watch('question.answers', function (answers) {
      var options = {};

      for (var i in answers || []) {
        options[i] = String.fromCharCode(97 + parseInt(i));
      }

      if ((answers || []).length - 1 < parseInt($scope.question.rightAnswer)) {
        $scope.question.rightAnswer = '';
      }

      $scope.options = options;
    }, true);
  }
})();
