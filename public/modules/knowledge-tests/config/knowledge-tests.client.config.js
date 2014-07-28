'use strict';

// Configuring the Articles module
angular.module('knowledge-tests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Avaliações', 'knowledge-tests', 'dropdown', '/knowledge-tests(/create)?', null, ['professor']);
		Menus.addSubMenuItem('topbar', 'knowledge-tests', 'Listar', 'knowledge-tests', null, null, ['professor']);
		Menus.addSubMenuItem('topbar', 'knowledge-tests', 'Nova Avaliação', 'knowledge-tests/create', null, null, ['professor']);
	}
]);