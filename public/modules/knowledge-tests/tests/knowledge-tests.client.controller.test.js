'use strict';

(function() {
	// Knowledge tests Controller Spec
	describe('Knowledge tests Controller Tests', function() {
		// Initialize global variables
		var KnowledgeTestsController,
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

			// Initialize the Knowledge tests controller.
			KnowledgeTestsController = $controller('KnowledgeTestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Knowledge test object fetched from XHR', inject(function(KnowledgeTests) {
			// Create sample Knowledge test using the Knowledge tests service
			var sampleKnowledgeTest = new KnowledgeTests({
				name: 'New Knowledge test'
			});

			// Create a sample Knowledge tests array that includes the new Knowledge test
			var sampleKnowledgeTests = [sampleKnowledgeTest];

			// Set GET response
			$httpBackend.expectGET('knowledge-tests').respond(sampleKnowledgeTests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.knowledgeTests).toEqualData(sampleKnowledgeTests);
		}));

		it('$scope.findOne() should create an array with one Knowledge test object fetched from XHR using a knowledgeTestId URL parameter', inject(function(KnowledgeTests) {
			// Define a sample Knowledge test object
			var sampleKnowledgeTest = new KnowledgeTests({
				name: 'New Knowledge test'
			});

			// Set the URL parameter
			$stateParams.knowledgeTestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/knowledge-tests\/([0-9a-fA-F]{24})$/).respond(sampleKnowledgeTest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.knowledgeTest).toEqualData(sampleKnowledgeTest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(KnowledgeTests) {
			// Create a sample Knowledge test object
			var sampleKnowledgeTestPostData = new KnowledgeTests({
				name: 'New Knowledge test'
			});

			// Create a sample Knowledge test response
			var sampleKnowledgeTestResponse = new KnowledgeTests({
				_id: '525cf20451979dea2c000001',
				name: 'New Knowledge test'
			});

			// Fixture mock form input values
			scope.name = 'New Knowledge test';

			// Set POST response
			$httpBackend.expectPOST('knowledge-tests', sampleKnowledgeTestPostData).respond(sampleKnowledgeTestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Knowledge test was created
			expect($location.path()).toBe('/knowledge-tests/' + sampleKnowledgeTestResponse._id);
		}));

		it('$scope.update() should update a valid Knowledge test', inject(function(KnowledgeTests) {
			// Define a sample Knowledge test put data
			var sampleKnowledgeTestPutData = new KnowledgeTests({
				_id: '525cf20451979dea2c000001',
				name: 'New Knowledge test'
			});

			// Mock Knowledge test in scope
			scope.knowledgeTest = sampleKnowledgeTestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/knowledge-tests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/knowledge-tests/' + sampleKnowledgeTestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid knowledgeTestId and remove the Knowledge test from the scope', inject(function(KnowledgeTests) {
			// Create new Knowledge test object
			var sampleKnowledgeTest = new KnowledgeTests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Knowledge tests array and include the Knowledge test
			scope.knowledgeTests = [sampleKnowledgeTest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/knowledge-tests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleKnowledgeTest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.knowledgeTests.length).toBe(0);
		}));
	});
}());