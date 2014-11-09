'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var TokenSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  expiration: Date,
  accessToken: String,
  refreshToken: String
});


TokenSchema.pre('save', function(next) {

  var Token = mongoose.model('Token');

  if (!this.expiration) {
    var expiration = new Date();
    expiration.setDate(expiration.getDate() + 30);
    this.expiration = expiration;
  }

  Token
    .find({expiration: {$lte: new Date()}})
    .remove()
    .exec(function() { next(); });
});

module.exports = mongoose.model('Token', TokenSchema);