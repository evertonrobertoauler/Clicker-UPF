'use strict';

module.exports = function(config) {

  var	mongoose = require('mongoose');

  mongoose.connect(config.db, function(err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  });
};