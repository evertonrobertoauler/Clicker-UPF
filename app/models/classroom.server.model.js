'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Classroom Schema
 */
var ClassroomSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Campo Nome é obrigatório',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Classroom', ClassroomSchema);
