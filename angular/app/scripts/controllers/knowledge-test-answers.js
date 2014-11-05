'use strict';

angular
  .module('openpiApp')
  .controller('KnowledgeTestAnswersCtrl', function($scope, $timeout, KnowledgeTestAnswers) {

    $scope.knowledgeTestAnswer = $scope.$parent.$parent.obj;
    $scope.knowledgeTestAnswer.start = new Date($scope.knowledgeTestAnswer.start);
    $scope.knowledgeTestAnswer.end = new Date($scope.knowledgeTestAnswer.end);

    $scope.save = function() {

      var error = function(e) {
        $scope.iForm.setErrors(e.data);
      };

      var success = function() {
        $scope.success = 'Resposta salva com successo!';

        $timeout(function() {
          $scope.success = '';
        }, 3000);
      };

      KnowledgeTestAnswers.update($scope.knowledgeTestAnswer).$promise.then(success, error);
    };
  });