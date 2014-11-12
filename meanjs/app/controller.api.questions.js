'use strict';

(function() {

  var mongoose = require('mongoose');
  var jsonschema = require('jsonschema');
  var config = require('./../config/config');

  var db = mongoose.connections[0].db;
  var ObjectID = mongoose.mongo.ObjectID;
  var collection = db.collection('question');

  var changeAttrId = function(obj) {
    obj.id = obj._id;
    delete obj._id;
    return obj;
  };

  var schema = {
    type: 'object',
    properties: {
      text: {type: 'string', required: true},
      answers: {
        type: 'array',
        required: true,
        items: {type: 'string', required: true}
      },
      rightAnswer: {type: 'integer', required: true}
    }
  };

  exports.list = function(req, res) {

    var q = req.query;

    var where = {'professor.id': req.user._id};
    var limit = Math.min(10, q.limit || 10);
    var offset = ((q.offset || 1) - 1) * limit;
    var sort = q.sort || {_id: -1};

    collection.count(where, function(err, length) {
      collection.find(where).limit(limit).skip(offset).sort(sort).toArray(function(err, items) {
        if (err || !items) {
          res.status(500).send();
        } else {
          res.jsonp({length: length, list: items.map(changeAttrId)});
        }
      });
    });
  };

  exports.insert = function(req, res) {
    var result = jsonschema.validate(req.body, schema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.question.insert', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.get = function(req, res) {

    var filter = {_id: new ObjectID(req.params.id), 'professor.id': req.user._id};

    collection.findOne(filter, function(err, item) {
      if (err || !item) {
        res.status(404).send();
      } else {
        res.jsonp(changeAttrId(item));
      }
    });
  };

  exports.update = function(req, res) {
    req.body.id = req.params.id;

    var result = jsonschema.validate(req.body, schema);

    if (result.errors.length) {
      res.status(400).jsonp(result.errors);
    } else {
      result.instance.professor = req.user._id.toString();
      config.celery.runTask('tasks.question.update', [result.instance]);
      res.jsonp(result.instance);
    }
  };

  exports.delete = function(req, res) {
    if (req.params.id) {
      var filter = {id: req.params.id, professor: req.user._id.toString()};
      config.celery.runTask('tasks.question.delete', [filter]);
      res.jsonp(filter);
    } else {
      res.status(400).send();
    }
  };
})();