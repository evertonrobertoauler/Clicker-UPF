exports.config = {

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['src/**/*.e2e.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
  }
};
