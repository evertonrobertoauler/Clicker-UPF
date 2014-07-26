'use strict';

// Knoledge tests controller
angular.module('knoledge-tests').controller('KnoledgeTestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'KnoledgeTests',
	function($scope, $stateParams, $location, Authentication, KnoledgeTests ) {
		$scope.authentication = Authentication;

		// Create new Knoledge test
		$scope.create = function() {
			// Create new Knoledge test object
			var knoledgeTest = new KnoledgeTests ({
				name: this.name
			});

			// Redirect after save
			knoledgeTest.$save(function(response) {
				$location.path('knoledge-tests/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Knoledge test
		$scope.remove = function( knoledgeTest ) {
			if ( knoledgeTest ) { knoledgeTest.$remove();

				for (var i in $scope.knoledgeTests ) {
					if ($scope.knoledgeTests [i] === knoledgeTest ) {
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
			var knoledgeTest = $scope.knoledgeTest ;

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
	}
]);