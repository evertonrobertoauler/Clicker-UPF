'use strict';

var createParser = require('./parser');

exports.Save = createParser({
  text: {
    type: String,
    required: 'Question text is required!',
  },
  answers: [String],
  rightAnswer: {
    type: Number,
    min: 0,
    required: 'Right answer is required!',
  },
});