'use strict';

(function() {

  var config = require('./../config/config');
  var queries = require('./queries');
  var SaveParser = require('./parsers.question').Save;
  var Question = require('mongoose').model('Question');

  exports.list = function(req, res) {

    var filter = queries.filter(req.query);
    filter.where = {'professor._id': req.user._id};

    queries
      .findList('Question', filter)
      .then(function(data) {
        res.jsonp({length: data[0], list: data[1]});
      })
      .fail(function(error) {
        res.status(500).jsonp(error);
      });
  };

  exports.insert = function(req, res) {

    var parser = new SaveParser(req.body);

    parser.validate()
      .then(function(data) {
        console.log(data);
        var question = new Question(data);
        console.log(question);
        question.professor = req.user;
        return queries.exec(question, 'save');
      })
      .then(function(data) {
        res.jsonp(data);
      })
      .fail(function(error) {
        console.trace(error);
        res.status(400).jsonp(error);
      });
  };

  exports.get = function(req, res) {
    queries
      .exec(Question.findOne({
          _id: req.params.id,
          'professor._id': req.user._id}
      ))
      .then(function(data) {
        res.jsonp(data);
      })
      .fail(function(error) {
        res.status(400).jsonp(error);
      });
  };

  exports.update = function(req, res) {
    exports.insert(req, res);
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