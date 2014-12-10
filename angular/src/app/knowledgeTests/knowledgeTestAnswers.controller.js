(function () {
  'use strict';

  angular
    .module('openpiApp.knowledgeTests')
    .controller('KnowledgeTestAnswersController', KnowledgeTestAnswersController);

  /** @ngInject */
  function KnowledgeTestAnswersController($scope, $timeout, KnowledgeTestAnswers) {

    $scope.knowledgeTestAnswer = $scope.$parent.$parent.obj;
    $scope.knowledgeTestAnswer.start = new Date($scope.knowledgeTestAnswer.start);
    $scope.knowledgeTestAnswer.end = new Date($scope.knowledgeTestAnswer.end);

    var answer = $scope.knowledgeTestAnswer.answers[0];
    $scope.knowledgeTestAnswer.answer = answer.answer;
    $scope.knowledgeTestAnswer.triedAnswers = answer.triedAnswers;

    $scope.$watch('knowledgeTestAnswer.answer', function (value) {
      if (answer.answer !== value) {
        answer.answer = value;
        $scope.save();
      }
    });

    $scope.save = function () {

      var error = function (e) {
        $scope.iForm.setErrors(e.data);
      };

      var success = function () {
        $scope.success = 'Resposta salva com successo!';

        $timeout(function () {
          $scope.success = '';
        }, 3000);
      };

      KnowledgeTestAnswers.update($scope.knowledgeTestAnswer).$promise.then(success, error);
    };
  }
})();
