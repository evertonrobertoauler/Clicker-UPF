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

      var end = new Date();
      end.setMinutes(end.getMinutes() - 1);

      KnowledgeTest.find({
        classroom: {$in: classrooms},
        start: {$lte: new Date()},
        end: {$gte: end}
      }).populate('classroom', 'name -_id')
        .populate('user', 'displayName -_id')
        .populate('question', 'text answers -_id')
        .exec(function(err, tests) {
          (tests || []).forEach(function(t) {
            t.answers = (t.answers || []).filter(function(a) {
              return a.student.toString() === user._id.toString();
            });
          });

          resolve(tests);
        });
    });
  };
};

var answerKnowledgeTest = function(id, user, answer) {
  return function(classrooms) {
    return new Promises(function(resolve, reject) {

      var end = new Date();
      end.setMinutes(end.getMinutes() - 1);

      var filter = {
        _id: id,
        classroom: {$in: classrooms},
        start: {$lte: new Date()},
        end: {$gte: end}
      };

      KnowledgeTest.findOne(filter, function(err, test) {
        if (test) {
          test.answers = test.answers.filter(function(a) {
            return a.student.toString() !== user._id.toString();
          });

          test.answers.push({
            student: user._id,
            answer: answer
          });

          test.save();

          resolve('Resposta salva com sucesso!');
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
    .then(answerKnowledgeTest(req.params.testId, req.user, req.body.answer))
    .then(function(msg) {
      res.json({success: msg});
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
