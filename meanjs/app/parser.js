'use strict';

var mongoose = require('mongoose');
var Q = require('q');

module.exports = function(objSchema) {

  var schema = new mongoose.Schema(objSchema, {_id: false});

  var Parser = function(data) {
    this.schema = schema;
    mongoose.Document.call(this, data);
  };

  var proto = '__proto__';
  Parser.prototype[proto] = mongoose.Document.prototype;

  Parser.prototype.validate = function() {
    var self = this;

    return Q.Promise(function(resolve, reject) {
      mongoose.Document.prototype.validate.call(self, function(err) {
        if (err) { reject(err); }
        else { resolve(self); }
      });
    });
  };

  return Parser;
};