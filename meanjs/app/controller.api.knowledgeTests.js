'use strict';

(function() {

  var jsonschema = require('jsonschema');
  var config = require('./../../../config/config');

  var insertSchema = {
    type: 'object',
    properties: {
      classroom: {type: 'string', required: true},
      question: {type: 'string', required: true},
      end: {type: 'date', required: true},
      start: {type: 'date', required: true}
    }
  };

  var updateSchema = {
    type: 'object',
    properties: {
      id: {type: 'string', required: true},
      end: {type: 'date', required: true},
      start: {type: 'date', required: true}
    }
  };

  exports.list = function(req, res) {
    res.jsonp({length: 0, list: []});
  };

  exports.insert = function(req, res) {
    var result = jsonschema.validate(req.body, insertSchema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.knowledge_test.insert', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.update = function(req, res) {
    req.body.id = req.params.id;

    var result = jsonschema.validate(req.body, updateSchema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.knowledge_test.update', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.delete = function(req, res) {
    if (req.params.id) {
      var filter = {id: req.params.id, professor: req.user._id.toString()};
      config.celery.runTask('tasks.knowledge_test.delete', [filter]);
      res.jsonp(filter);
    } else {
      res.status(400).send();
    }
  };
})();
