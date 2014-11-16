'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: String,
  args: [],
  date: Date,
});

module.exports = mongoose.model('Task', TaskSchema);