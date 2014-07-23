'use strict';

(function() {
	// Classrooms Controller Spec
	describe('Classrooms Controller Tests', function() {
		// Initialize global variables
		var ClassroomsController,
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

			// Initialize the Classrooms controller.
			ClassroomsController = $controller('ClassroomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Classroom object fetched from XHR', inject(function(Classrooms) {
			// Create sample Classroom using the Classrooms service
			var sampleClassroom = new Classrooms({
				name: 'New Classroom'
			});

			// Create a sample Classrooms array that includes the new Classroom
			var sampleClassrooms = [sampleClassroom];

			// Set GET response
			$httpBackend.expectGET('classrooms').respond(sampleClassrooms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.classrooms).toEqualData(sampleClassrooms);
		}));

		it('$scope.findOne() should create an array with one Classroom object fetched from XHR using a classroomId URL parameter', inject(function(Classrooms) {
			// Define a sample Classroom object
			var sampleClassroom = new Classrooms({
				name: 'New Classroom'
			});

			// Set the URL parameter
			$stateParams.classroomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/classrooms\/([0-9a-fA-F]{24})$/).respond(sampleClassroom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.classroom).toEqualData(sampleClassroom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Classrooms) {
			// Create a sample Classroom object
			var sampleClassroomPostData = new Classrooms({
				name: 'New Classroom'
			});

			// Create a sample Classroom response
			var sampleClassroomResponse = new Classrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Classroom'
			});

			// Fixture mock form input values
			scope.name = 'New Classroom';

			// Set POST response
			$httpBackend.expectPOST('classrooms', sampleClassroomPostData).respond(sampleClassroomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Classroom was created
			expect($location.path()).toBe('/classrooms/' + sampleClassroomResponse._id);
		}));

		it('$scope.update() should update a valid Classroom', inject(function(Classrooms) {
			// Define a sample Classroom put data
			var sampleClassroomPutData = new Classrooms({
				_id: '525cf20451979dea2c000001',
				name: 'New Classroom'
			});

			// Mock Classroom in scope
			scope.classroom = sampleClassroomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/classrooms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/classrooms/' + sampleClassroomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid classroomId and remove the Classroom from the scope', inject(function(Classrooms) {
			// Create new Classroom object
			var sampleClassroom = new Classrooms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Classrooms array and include the Classroom
			scope.classrooms = [sampleClassroom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/classrooms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClassroom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.classrooms.length).toBe(0);
		}));
	});
}());