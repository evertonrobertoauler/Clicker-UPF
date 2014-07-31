'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  KnowledgeTest = mongoose.model('KnowledgeTest'),
  Classroom = mongoose.model('Classroom');

var Promises = require('promise');

var getClassrooms = function(user) {
  return new Promises(function(resolve) {
    Classroom.find({students: user._id})
      .select('_id')
      .exec(function(err, classrooms) {
        resolve((classrooms || []).map(function(c) {
          return c._id;
        }));
      });
  });
};

var getKnowledgeTest = function(user) {
  return function(classrooms) {
    return new Promises(function(resolve) {
      KnowledgeTest.find({
        classroom: {$in: classrooms},
        start: {$lte: new Date()},
        end: {$gte: new Date()}
      }).populate('classroom', 'name -_id')
        .populate('user', 'displayName -_id')
        .populate('question', 'text answers -_id')
        .exec(function(err, tests) {
          (tests || []).forEach(function(t) {
            t.answers = (t.answers || []).filter(function(a) {
              return a.student === user._id;
            });
          });

          resolve(tests);
        });
    });
  };
};

var answerKnowledgeTest = function(user, body) {
  return function(classrooms) {
    return new Promises(function(resolve, reject) {

      var filter = {
        _id: body.id,
        classroom: {$in: classrooms},
        start: {$lte: new Date()},
        end: {$gte: new Date()}
      };

      KnowledgeTest.findOne(filter, function(err, test) {
        if (test) {
          test.answers = test.answers.filter(function(a) {
            return a.student !== user._id;
          });

          var answer = {
            student: user._id,
            answer: body.answer
          };

          test.answers.push(answer);
          test.save();

          resolve(answer);
        } else {
          reject('Tempo para resposta encerrado!');
        }
      });
    });
  };
};

/**
 * Answer a Question
 */
exports.update = function(req, res) {
  getClassrooms(req.user)
    .then(answerKnowledgeTest(req.user, req.body))
    .then(function(answer) {
      res.json(answer);
    }, function(error) {
      res.json(410, {error: error}); // GONE
    });
};

/**
 * List of Questions
 */
exports.list = function(req, res) {
  getClassrooms(req.user)
    .then(getKnowledgeTest(req.user))
    .then(function(tests) {
      res.json(tests);
    });
};
