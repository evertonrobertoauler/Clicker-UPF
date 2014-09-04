'use strict';

angular.module('classrooms').run(function(Menus) {
  Menus.addMenuItem('topbar', 'Turmas', 'classrooms', 'item', '/classrooms', null, ['professor']);
});
