'use strict';

describe('Directive: iForm', function () {

  // load the directive's module
  beforeEach(module('openpiApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('element content should remain', inject(function ($compile) {
    element = angular.element('<form i-form>test</form>');
    $compile(element)(scope);
    expect(element.html()).toBe('test');
  }));

  it('should add attributes', inject(function ($compile) {
    element = angular.element('<form i-form></form>');
    $compile(element)(scope);
    expect(element.attr('novalidate')).toBeDefined();
    expect(element.attr('class')).toMatch(/form-horizontal/);
    expect(element.attr('name')).toBe('iForm.form');
    expect(element.attr('i-form')).not.toBeDefined();
  }));
});
