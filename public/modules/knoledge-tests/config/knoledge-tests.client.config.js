'use strict';

// Configuring the Articles module
angular.module('knoledge-tests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Avaliações', 'knoledge-tests', 'dropdown', '/knoledge-tests(/create)?', null, ['professor']);
		Menus.addSubMenuItem('topbar', 'knoledge-tests', 'Listar', 'knoledge-tests', null, null, ['professor']);
		Menus.addSubMenuItem('topbar', 'knoledge-tests', 'Nova Avaliação', 'knoledge-tests/create', null, null, ['professor']);
	}
]);