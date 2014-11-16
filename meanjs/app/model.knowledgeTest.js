'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answer = {
  _id: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  answer: Number,
  triedAnswers: [Number],
};

var KnowledgeTestSchema = new Schema({
  classroom: {
    _id: {type: Schema.Types.ObjectId, ref: 'Classroom'},
    name: String
  },
  question: {
    _id: {type: Schema.Types.ObjectId, ref: 'Question'},
    text: String,
    answers: [String],
    rightAnswer: Number,
  },
  answers: [answer],
  start: Date,
  end: Date,
  professor: {
    _id: {type: Schema.Types.ObjectId, ref: 'User'},
    name: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  open: {type: Boolean, default: false},
});

module.exports = mongoose.model('KnowledgeTest', KnowledgeTestSchema);