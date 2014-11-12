'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
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
  professor: {
    _id: {type: Schema.Types.ObjectId, ref: 'User'},
    displayName: String
  },
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Question', QuestionSchema);