'use strict';

// Knoledge tests controller
angular.module('knoledge-tests').controller('KnoledgeTestsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'KnoledgeTests', 'Classrooms', 'Questions',
  function($scope, $stateParams, $location, Authentication, KnoledgeTests, Classrooms, Questions) {
    $scope.authentication = Authentication;

    // Create new Knoledge test
    $scope.create = function() {

      var period = $scope.getPeriodDate();

      // Create new Knoledge test object
      var knoledgeTest = new KnoledgeTests({
        question: this.question._id,
        classroom: this.classroom._id,
        start: period[0],
        end: period[1]
      });

      // Redirect after save
      knoledgeTest.$save(function(response) {
        $location.path('knoledge-tests/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Knoledge test
    $scope.remove = function(knoledgeTest) {
      if (knoledgeTest) {
        knoledgeTest.$remove();

        for (var i in $scope.knoledgeTests) {
          if ($scope.knoledgeTests [i] === knoledgeTest) {
            $scope.knoledgeTests.splice(i, 1);
          }
        }
      } else {
        $scope.knoledgeTest.$remove(function() {
          $location.path('knoledge-tests');
        });
      }
    };

    // Update existing Knoledge test
    $scope.update = function() {
      var knoledgeTest = $scope.knoledgeTest;

      var period = $scope.getPeriodDate();
      knoledgeTest.start = period[0];
      knoledgeTest.end = period[1];

      knoledgeTest.$update(function() {
        $location.path('knoledge-tests/' + knoledgeTest._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Knoledge tests
    $scope.find = function() {
      $scope.knoledgeTests = KnoledgeTests.query();
    };

    // Find existing Knoledge test
    $scope.findOne = function() {
      $scope.knoledgeTest = KnoledgeTests.get({
        knoledgeTestId: $stateParams.knoledgeTestId
      });
    };

    $scope.loadOptions = function() {
      $scope.classrooms = Classrooms.query();
      $scope.questions = Questions.query();
    };

    $scope.openDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.today = new Date();
    $scope.startDate = new Date();
    $scope.startTime = new Date();
    $scope.testTime = moment('00:05', 'h:mm').toDate();

    $scope.getPeriodDate = function() {

      var start = moment(
          ($scope.startDate || new Date()).toISOString().substr(0, 11) +
          ($scope.startTime || new Date()).toISOString().substr(11, 5) + ':00'
      ).subtract('hours', 3).toDate();

      var end = moment(start).add('hours', $scope.testTime.getHours())
        .add('minutes', $scope.testTime.getMinutes())
        .toDate();

      return [start, end];
    };

    $scope.findOneEdit = function() {
      $scope.findOne();
      $scope.knoledgeTest.$promise.then(function(k) {
        $scope.startDate = new Date(k.start);
        $scope.startTime = new Date(k.start);

        $scope.testTime = moment('00:00', 'h:mm')
          .add('minutes', moment(k.end).diff(moment(k.start), 'minutes'))
          .toDate();
      });
    };
  }
]);