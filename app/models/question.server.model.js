'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var answerSchema = {
  type: String,
  required: 'Preencha todas as alternativas',
  trim: true
};

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
  answers: [answerSchema],
  rightAnswer: {
    type: Number,
    default: 0,
    required: 'Marque a Alternativa Correta'
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

mongoose.model('Question', QuestionSchema);