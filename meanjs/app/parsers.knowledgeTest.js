'use strict';

var Schema = require('mongoose').Schema;
var createParser = require('./parser');

exports.Insert = createParser({
  question: {
    type: Schema.Types.ObjectId,
    required: 'Question required'
  },
  classroom: {
    type: Schema.Types.ObjectId,
    required: 'Classroom required'
  },
  start: {
    type: Date,
    required: 'Start date required'
  },
  end: {
    type: Date,
    required: 'Start date required'
  }
});

exports.Update = createParser({
  start: {
    type: Date,
    required: 'Start date required'
  },
  end: {
    type: Date,
    required: 'Start date required'
  }
});

exports.Answer = createParser({
  answer: {
    type: Number,
    min: 0,
    required: 'Right answer is required!',
  },
});