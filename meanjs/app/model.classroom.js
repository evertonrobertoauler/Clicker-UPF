'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = {
  _id: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String
};

var ClassroomSchema = new Schema({
  name: {
    type: String,
    required: 'Classroom name is required!',
  },
  students: [user],
  professor: user,
  created: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Classroom', ClassroomSchema);