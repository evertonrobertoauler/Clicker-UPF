'use strict';

//Setting up route
angular.module('knoledge-tests').config(['$stateProvider',
	function($stateProvider) {
		// Knoledge tests state routing
		$stateProvider.
		state('listKnoledgeTests', {
			url: '/knoledge-tests',
			templateUrl: 'modules/knoledge-tests/views/list-knoledge-tests.client.view.html'
		}).
		state('createKnoledgeTest', {
			url: '/knoledge-tests/create',
			templateUrl: 'modules/knoledge-tests/views/create-knoledge-test.client.view.html'
		}).
		state('viewKnoledgeTest', {
			url: '/knoledge-tests/:knoledgeTestId',
			templateUrl: 'modules/knoledge-tests/views/view-knoledge-test.client.view.html'
		}).
		state('editKnoledgeTest', {
			url: '/knoledge-tests/:knoledgeTestId/edit',
			templateUrl: 'modules/knoledge-tests/views/edit-knoledge-test.client.view.html'
		});
	}
]);