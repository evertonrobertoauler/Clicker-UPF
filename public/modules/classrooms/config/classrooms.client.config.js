'use strict';

// Configuring the Articles module
angular.module('classrooms').run(['Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Turma', 'classrooms', 'dropdown', '/classrooms(/create)?', null, ['professor']);
    Menus.addSubMenuItem('topbar', 'classrooms', 'Listar', 'classrooms', null, null, ['professor']);
    Menus.addSubMenuItem('topbar', 'classrooms', 'Nova Turma', 'classrooms/create', null, null, ['professor']);
  }
]);
