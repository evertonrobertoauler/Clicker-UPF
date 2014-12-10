(function () {
  'use strict';

  angular
    .module('idea')
    .directive('countdown', countdown);

  /** @ngInject */
  function countdown($interval) {
    return {
      template: '<span ng-if="seconds">{{ hours + \':\' +minutes + \':\' + seconds }}</span>',
      restrict: 'E',
      scope: {
        end: '=',
      },
      link: function (scope) {

        var end, now, interval;

        scope.$watch('end', function () {
          if (scope.end && scope.end.getTime() !== end) {
            end = scope.end.getTime();
            now = (new Date()).getTime();

            scope.time = (end - now);
            scope.hours = scope.minutes = scope.seconds = '00';

            $interval.cancel(interval);

            interval = $interval(function () {
              scope.time -= 1000;

              if (scope.time > 0) {
                scope.seconds = ('0' + Math.floor((scope.time / 1000) % 60)).substr(-2, 2);
                scope.minutes = ('0' + Math.floor((scope.time / 60000) % 60)).substr(-2, 2);
                scope.hours = '0' + Math.floor(((scope.time / 60000) / 60));
              } else {
                scope.hours = scope.minutes = scope.seconds = '00';
                $interval.cancel(interval);
              }
            }, 1000);
          }
        });
      }
    };
  }
})();
