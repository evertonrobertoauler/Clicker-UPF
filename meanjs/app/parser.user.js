'use strict';

var createParser = require('./parser');

exports.Insert = createParser({
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your first name',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your last name',
  },
  email: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your email',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    default: '',
    required: 'Password should be longer',
  },
});

exports.Update = createParser({
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your first name',
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your last name',
  },
});