'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Classroom = mongoose.model('Classroom'),
  _ = require('lodash');


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Classroom already exists';
        break;
      default:
        message = 'Erro desconhecido';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * Create a Classroom
 */
exports.create = function(req, res) {
  var classroom = new Classroom(req.body);
  classroom.user = req.user;

  classroom.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(classroom);
    }
  });
};

/**
 * Show the current Classroom
 */
exports.read = function(req, res) {
  res.jsonp(req.classroom);
};

/**
 * Update a Classroom
 */
exports.update = function(req, res) {
  var classroom = req.classroom;

  classroom = _.extend(classroom, req.body);

  classroom.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(classroom);
    }
  });
};

/**
 * Delete an Classroom
 */
exports.delete = function(req, res) {
  var classroom = req.classroom;

  classroom.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(classroom);
    }
  });
};

/**
 * List of Classrooms
 */
exports.list = function(req, res) {
  Classroom.find({user: req.user}).sort('name -created')
    .populate('user', 'displayName')
    .populate({
      path: 'students',
      sort: {displayName: 'asc'},
      select: 'displayName',
    })
    .exec(function(err, classrooms) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        res.jsonp(classrooms);
      }
    });
};

/**
 * Classroom middleware
 */
exports.classroomByID = function(req, res, next, id) {
  Classroom.findById(id)
    .populate('user', 'displayName')
    .populate({
      path: 'students',
      sort: {displayName: 'asc'},
      select: 'displayName',
    }).exec(function(err, classroom) {
      if (err) return next(err);
      if (!classroom) return next(new Error('Falha ao buscar Turma ' + id));
      req.classroom = classroom;
      next();
    });
};

/**
 * Classroom authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.classroom.user.id !== req.user.id) {
    return res.send(403, 'Usuário não autorizado!');
  }
  next();
};
