'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  text: {
    type: String,
    default: '',
    required: 'Preencha o campo de pergunta',
    trim: true
  },
  answers: {
    type: [
      {
        type: String,
        required: 'Preencha todas as alternativas',
        trim: true
      }
    ]
  },
  rightAnswer: Number,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Question', QuestionSchema);