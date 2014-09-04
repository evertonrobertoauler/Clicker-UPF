'use strict';

// Configuring the Articles module
angular.module('knowledge-tests').run(function(Menus) {
  Menus.addMenuItem(
    'topbar', 'Avaliações', 'knowledge-tests', 'item', '/knowledge-tests', null, ['professor']
  );
});