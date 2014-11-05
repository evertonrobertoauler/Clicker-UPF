'use strict';

angular
  .module('openpiApp')
  .directive('iDateTime', function($timeout) {
    return {
      restrict: 'A',
      priority: 10,
      link: function(scope, elem) {
        if (scope.field.ngModel) {

          var mask, options = {};

          switch (scope.field.type) {
            case 'date':
              mask = '00/00/0000';
              options.format = 'dd/MM/yyyy';
              options.pickTime = false;
              break;
            case 'time':
              mask = '00:00';
              options.format = 'hh:mm';
              options.pickDate = false;
              options.pickSeconds = false;
              break;
            case 'datetime':
              mask = '00/00/0000 00:00';
              options.format = 'dd/MM/yyyy hh:mm';
              options.pickSeconds = false;
              break;
          }

          options.language = 'pt-BR';

          elem.mask(mask);
          elem.datetimepicker(options);

          var picker = elem.data('datetimepicker');

          var value;

          elem.on('keyup', function(e) {

            var cursor = this.selectionStart;
            if (
              elem.val().length === options.format.length &&
              [16, 37, 38, 39, 40].indexOf(e.keyCode) === -1
              ) {
              picker.change(e);
              this.selectionStart = this.selectionEnd = cursor;
            }
          });

          elem.on('blur', function(e) {
            picker.hide(e);
          });

          elem.on('changeDate', function(e) {

            var newValue = e.localDate;

            if (value !== newValue) {
              value = newValue;

              if (scope.field.type === 'date') {
                picker.widget.hide();
              }

              $timeout(function() {
                scope.setValue(newValue);
              }, 1);
            }
          });

          scope.$watch('value', function(newValue) {
            if (JSON.stringify(newValue) !== JSON.stringify(value)) {

              if (typeof newValue === 'string') {
                value = new Date(newValue);
              } else if (newValue) {
                value = newValue;
              }

              if (value) {
                value.setSeconds(0);
                picker.setLocalDate(value);
              }
            }
          });

          scope.$parent.togglePicker = function(e) {
            picker.show(e);
          };
        }
      }
    };
  });