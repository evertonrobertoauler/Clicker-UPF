'use strict';

var createSerializer = require('./serializer');

var UserSerializer = createSerializer({
  firstName: String,
  lastName: String,
  displayName: String,
  email: String,
  provider: String,
  roles: [String],
  updated: Date,
  created: Date
});

module.exports = function(obj) {
  var doc = new UserSerializer(obj);
  return doc.toObject();
};