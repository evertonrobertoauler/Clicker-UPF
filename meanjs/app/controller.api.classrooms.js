'use strict';

(function() {

  var mongoose = require('mongoose');
  var collections = mongoose.connection.collections;
  var jsonschema = require('jsonschema');
  var config = require('./../config/config');

  var schema = {
    type: 'object',
    properties: {
      name: {type: 'string', required: true},
      students: {
        type: 'array',
        items: {type: 'string', required: true}
      },
    }
  };

  exports.list = function(req, res) {
    if (collections.classroom) {
      res.jsonp({length: 0, list: []});
    } else {
      res.jsonp({length: 0, list: []});
    }
  };

  exports.insert = function(req, res) {
    var result = jsonschema.validate(req.body, schema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.classroom.insert', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.update = function(req, res) {
    req.body.id = req.params.id;

    var result = jsonschema.validate(req.body, schema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.classroom.update', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.delete = function(req, res) {
    if (req.params.id) {
      var filter = {id: req.params.id, professor: req.user._id.toString()};
      config.celery.runTask('tasks.classroom.delete', [filter]);
      res.jsonp(filter);
    } else {
      res.status(400).send();
    }
  };
})();