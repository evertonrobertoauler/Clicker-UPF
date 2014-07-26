'use strict';

// Configuring the Articles module
angular.module('knoledge-tests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Knoledge tests', 'knoledge-tests', 'dropdown', '/knoledge-tests(/create)?');
		Menus.addSubMenuItem('topbar', 'knoledge-tests', 'List Knoledge tests', 'knoledge-tests');
		Menus.addSubMenuItem('topbar', 'knoledge-tests', 'New Knoledge test', 'knoledge-tests/create');
	}
]);