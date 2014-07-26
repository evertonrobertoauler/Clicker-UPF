'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var answerSchema = {
  student: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  answer: Number
};

/**
 * Knoledge test Schema
 */
var KnoledgeTestSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  question: {
    type: Schema.ObjectId,
    ref: 'Question',
    required: 'Selecione uma Pergunta'
  },
  classroom: {
    type: Schema.ObjectId,
    ref: 'Classroom',
    required: 'Selecione uma Turma'
  },
  start: {
    type: Date,
    required: 'Defina um horário para início'
  },
  end: {
    type: Date,
    required: 'Defina um horário para término'
  },
  answers: [answerSchema],
});

mongoose.model('KnoledgeTest', KnoledgeTestSchema);