'use strict';

describe('Directive: iModel', function () {

  // load the directive's module
  beforeEach(module('openpiApp'));

  var element, ctrl, iformfield, scope;

  beforeEach(inject(function ($rootScope, $compile) {
    ctrl = $rootScope.$new();
    ctrl.variable = 'test';

    iformfield = ctrl.$new();
    iformfield.model = 'variable';
    iformfield.field = {
      getName: function(){
        return iformfield.model;
      },
    };

    scope = iformfield.$new();
    element = angular.element('<input i-model/>');
    element = $compile(element)(scope);
    element.scope().$apply();
  }));

  it('value should be the same of ctrl.variable', inject(function () {
    expect(scope.value).toBe('test');
  }));

  it('should update the model value when ctrl.variable changes', inject(function () {
    ctrl.variable = 'test2';

    element.scope().$apply();

    expect(scope.value).toBe('test2');
  }));

  it('should update the ctrl.variable when model changes', inject(function () {

    scope.value = 'test3';

    element.scope().$apply();

    expect(ctrl.variable).toBe('test3');
  }));
});
