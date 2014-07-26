'use strict';

(function() {
	// Knoledge tests Controller Spec
	describe('Knoledge tests Controller Tests', function() {
		// Initialize global variables
		var KnoledgeTestsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Knoledge tests controller.
			KnoledgeTestsController = $controller('KnoledgeTestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Knoledge test object fetched from XHR', inject(function(KnoledgeTests) {
			// Create sample Knoledge test using the Knoledge tests service
			var sampleKnoledgeTest = new KnoledgeTests({
				name: 'New Knoledge test'
			});

			// Create a sample Knoledge tests array that includes the new Knoledge test
			var sampleKnoledgeTests = [sampleKnoledgeTest];

			// Set GET response
			$httpBackend.expectGET('knoledge-tests').respond(sampleKnoledgeTests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.knoledgeTests).toEqualData(sampleKnoledgeTests);
		}));

		it('$scope.findOne() should create an array with one Knoledge test object fetched from XHR using a knoledgeTestId URL parameter', inject(function(KnoledgeTests) {
			// Define a sample Knoledge test object
			var sampleKnoledgeTest = new KnoledgeTests({
				name: 'New Knoledge test'
			});

			// Set the URL parameter
			$stateParams.knoledgeTestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/knoledge-tests\/([0-9a-fA-F]{24})$/).respond(sampleKnoledgeTest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.knoledgeTest).toEqualData(sampleKnoledgeTest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(KnoledgeTests) {
			// Create a sample Knoledge test object
			var sampleKnoledgeTestPostData = new KnoledgeTests({
				name: 'New Knoledge test'
			});

			// Create a sample Knoledge test response
			var sampleKnoledgeTestResponse = new KnoledgeTests({
				_id: '525cf20451979dea2c000001',
				name: 'New Knoledge test'
			});

			// Fixture mock form input values
			scope.name = 'New Knoledge test';

			// Set POST response
			$httpBackend.expectPOST('knoledge-tests', sampleKnoledgeTestPostData).respond(sampleKnoledgeTestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Knoledge test was created
			expect($location.path()).toBe('/knoledge-tests/' + sampleKnoledgeTestResponse._id);
		}));

		it('$scope.update() should update a valid Knoledge test', inject(function(KnoledgeTests) {
			// Define a sample Knoledge test put data
			var sampleKnoledgeTestPutData = new KnoledgeTests({
				_id: '525cf20451979dea2c000001',
				name: 'New Knoledge test'
			});

			// Mock Knoledge test in scope
			scope.knoledgeTest = sampleKnoledgeTestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/knoledge-tests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/knoledge-tests/' + sampleKnoledgeTestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid knoledgeTestId and remove the Knoledge test from the scope', inject(function(KnoledgeTests) {
			// Create new Knoledge test object
			var sampleKnoledgeTest = new KnoledgeTests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Knoledge tests array and include the Knoledge test
			scope.knoledgeTests = [sampleKnoledgeTest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/knoledge-tests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleKnoledgeTest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.knoledgeTests.length).toBe(0);
		}));
	});
}());