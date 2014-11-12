'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  expiration: Date,
  accessToken: String,
  refreshToken: String
});

module.exports = mongoose.model('Question', QuestionSchema);