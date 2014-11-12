'use strict';

var mongoose = require('mongoose');
var Q = require('q');

module.exports = function(objSchema) {

  var schema = new mongoose.Schema(objSchema, {_id: false});

  var Parser = function(data) {
    this.schema = schema;
    mongoose.Document.call(this, data);
    return this;
  };

  Parser.prototype = mongoose.Document.prototype;

  Parser.prototype.validate = function() {
    return Q.Promise(function(resolve, reject) {
      mongoose.Document.prototype.validate.call(this, function(err) {
        if (err) { reject(err); }
        else { resolve(this); }
      });
    });
  };

  return Parser;
}
;