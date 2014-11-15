'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  moment = require('moment');

var TokenSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  expiration: Date,
  accessToken: String,
  refreshToken: String
});


TokenSchema.pre('save', function(next) {

  var Token = mongoose.model('Token');

  if (!this.expiration) {
    this.expiration = moment().add(1, 'week');
  }

  Token
    .find({expiration: {$lte: new Date()}})
    .remove()
    .exec(function() { next(); });
});

module.exports = mongoose.model('Token', TokenSchema);