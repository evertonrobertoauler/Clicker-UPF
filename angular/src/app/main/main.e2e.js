'use strict';

describe('openpiApp', function () {

  describe('main', function () {

    beforeEach(function () {
      browser.get('');
    });

    it('firt protractor test', function () {
      expect(browser.getTitle()).toEqual('Open Peer Instruction');
    });

    afterEach(function() {
      browser.manage().logs().get('browser').then(function(browserLog) {
        expect(browserLog.length).toEqual(0);
      });
    });
  });
});
