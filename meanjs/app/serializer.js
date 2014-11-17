'use strict';

var mongoose = require('mongoose');

module.exports = function(objSchema) {

  var schema = new mongoose.Schema(objSchema);

  var Serializer = function(data) {
    this.schema = schema;
    mongoose.Document.call(this, data);
  };

  var proto = '__proto__';
  Serializer.prototype[proto] = mongoose.Document.prototype;

  return Serializer;
};