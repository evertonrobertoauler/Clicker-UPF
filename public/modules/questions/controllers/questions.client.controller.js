'use strict';

// Questions controller
angular.module('questions').controller('QuestionsController',
  function($scope, $stateParams, $location, Authentication, Questions) {
    $scope.authentication = Authentication;

    $scope.Questions = Questions;

    $scope.config = [
      {
        label: 'Criada',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'created',
        filter: {date : 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Pergunta',
        classes: 'col-xs-8 col-sm-8 col-md-10 col-lg-10',
        field: 'text',
      },
    ];

    $scope.question = {
      answers: ['Alternativa 1'],
      rightAnswer: 0
    };

    // Create new Question
    $scope.create = function() {

      var question = new Questions($scope.question);

      // Redirect after save
      question.$save(function(response) {
        $location.path('questions/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // Clear form fields
      this.text = '';
      this.answers = [];
    };

    // Remove existing Question
    $scope.remove = function(question) {
      if (question) {
        question.$remove();

        for (var i in $scope.questions) {
          if ($scope.questions [i] === question) {
            $scope.questions.splice(i, 1);
          }
        }
      } else {
        $scope.question.$remove(function() {
          $location.path('questions');
        });
      }
    };

    // Update existing Question
    $scope.update = function() {
      var question = $scope.question;

      question.$update(function() {
        $location.path('questions/' + question._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Questions
    $scope.find = function() {
      $scope.questions = Questions.query();
    };

    // Find existing Question
    $scope.findOne = function() {
      $scope.question = Questions.get({
        id: $stateParams.questionId
      });
    };

    $scope.$watch('question.answers', function(answers){
      var options = {};

      for (var i in answers || []){
        options[i] = String.fromCharCode(97 + parseInt(i));
      }

      $scope.options = options;
    }, true);
  });