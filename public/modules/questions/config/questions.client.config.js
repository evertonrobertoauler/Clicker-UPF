'use strict';

// Configuring the Articles module
angular.module('questions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Perguntas', 'questions', 'dropdown', '/questions(/create)?', null, ['professor']);
		Menus.addSubMenuItem('topbar', 'questions', 'Listar', 'questions', null, null, ['professor']);
		Menus.addSubMenuItem('topbar', 'questions', 'Nova Pergunta', 'questions/create', null, null, ['professor']);
	}
]);