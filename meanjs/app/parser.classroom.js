'use strict';

var Schema = require('mongoose').Schema;
var createParser = require('./parser');

exports.Save = createParser({
  name: {
    type: String,
    required: 'Name is required!',
  },
  students: [Schema.Types.ObjectId],
});