'use strict';

angular
  .module('openpiApp')
  .directive('iNav', function($location) {
    return {
      templateUrl: '/views/directives/i-nav/base.html',
      restrict: 'A',
      transclude: true,
      scope: {
        nav: '=iNav',
      },
      link: function(scope, elem) {
        elem.addClass('navbar navbar-fixed-top navbar-inverse');
        elem.attr('role', 'navigation');
        elem.after('<br /><br /><br />');

        var collapseElem = elem.find('#iNavBar');

        scope.collapsed = false;

        collapseElem.on('hidden.bs.collapse', function() {
          scope.collapsed = false;
        });

        scope.location = $location;

        collapseElem.on('shown.bs.collapse', function() {
          scope.collapsed = true;
        });

        scope.collapse = function() {
          if (scope.collapsed) {
            collapseElem.collapse('hide');
          }
        };

        scope.canShow = function(role) {
          var roles = scope.nav.user && scope.nav.user.roles || [];
          return (!role && !roles.length || roles.indexOf(role) !== -1);
        };
      }
    };
  });
