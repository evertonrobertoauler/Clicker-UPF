'use strict';

// Classrooms controller
angular.module('classrooms').controller('ClassroomsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Classrooms', 'Users',
  function($scope, $stateParams, $location, Authentication, Classrooms, Users) {
    $scope.authentication = Authentication;

    $scope.Classrooms = Classrooms;

    $scope.config = [
      {
        label: 'Criada',
        classes: 'col-xs-4 col-sm-4 col-md-2 col-lg-2 text-center',
        field: 'created',
        filter: {date : 'dd/MM/yyyy HH:mm'}
      },
      {
        label: 'Nome',
        classes: 'col-xs-8 col-sm-8 col-md-10 col-lg-10',
        field: 'name',
      },
    ];

    $scope.students = [];

    // Create new Classroom
    $scope.create = function() {
      // Create new Classroom object
      var classroom = new Classrooms({
        name: this.name,
        students: this.students
      });

      // Redirect after save
      classroom.$save(function(response) {
        $location.path('classrooms/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // Clear form fields
      this.name = '';
    };

    // Remove existing Classroom
    $scope.remove = function(classroom) {
      if (classroom) {
        classroom.$remove();

        for (var i in $scope.classrooms) {
          if ($scope.classrooms[i] === classroom) {
            $scope.classrooms.splice(i, 1);
          }
        }
      } else {
        $scope.classroom.$remove(function() {
          $location.path('classrooms');
        });
      }
    };

    // Update existing Classroom
    $scope.update = function() {
      var classroom = $scope.classroom;

      classroom.$update(function() {
        $location.path('classrooms/' + classroom._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Classrooms
    $scope.find = function() {
      $scope.classrooms = Classrooms.query();
    };

    // Find existing Classroom
    $scope.findOne = function() {
      $scope.classroom = Classrooms.get({
        id: $stateParams.classroomId
      });
    };

    $scope.studentsIds = function() {
      $scope.findOne();
      $scope.classroom.$promise.then(function(c) {
        c.students = c.students.map(function(s) {
          return s._id;
        });
      });
    };

    $scope.displayStudents = function(classroom) {
      return classroom.students.map(function(s) {
        return s.displayName;
      }).join(', ');
    };

    $scope.findStudents = function() {

      $scope.allStudents = {};

      Users.query().$promise.then(function(result){
        result.forEach(function(student){
          $scope.allStudents[student._id] = student.displayName;
        });
      });
    };
  }
]);
