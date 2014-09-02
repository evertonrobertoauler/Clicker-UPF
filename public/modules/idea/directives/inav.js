'use strict';

/**
 * @ngdoc directive
 * @name idea.directive:iNav
 * @description
 * # iNav
 */
angular.module('idea')
  .directive('iNav', function () {
    return {
      templateUrl: '/modules/idea/views/directives/inav/base.html',
      restrict: 'A',
      transclude: true,
      scope: {
        nav: '=iNav',
      },
      link: function (scope, elem) {
        elem.addClass('navbar navbar-fixed-top navbar-inverse');
        elem.attr('role', 'navigation');
        elem.after('<br /><br /><br />');

        var collapseElem = elem.find('#iNavBar');

        scope.collapsed = false;

        collapseElem.on('hidden.bs.collapse', function () {
          scope.collapsed = false;
        });

        collapseElem.on('shown.bs.collapse', function () {
          scope.collapsed = true;
        });

        scope.collapse = function(){
          if (scope.collapsed) {
            collapseElem.collapse('hide');
          }
        };
      }
    };
  });
