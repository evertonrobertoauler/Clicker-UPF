'use strict';

//Classrooms service used to communicate Classrooms REST endpoints
angular.module('classrooms').factory('Classrooms', ['$resource',
	function($resource) {
		return $resource('classrooms/:classroomId', { classroomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);