'use strict';

//Knowledge tests service used to communicate Knowledge tests REST endpoints
angular.module('knowledge-tests').factory('KnowledgeTests', ['$resource',
	function($resource) {
		return $resource('knowledge-tests/:knowledgeTestId', { knowledgeTestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);