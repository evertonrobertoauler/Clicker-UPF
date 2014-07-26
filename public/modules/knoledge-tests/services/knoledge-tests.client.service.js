'use strict';

//Knoledge tests service used to communicate Knoledge tests REST endpoints
angular.module('knoledge-tests').factory('KnoledgeTests', ['$resource',
	function($resource) {
		return $resource('knoledge-tests/:knoledgeTestId', { knoledgeTestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);