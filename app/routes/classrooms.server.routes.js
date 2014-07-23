'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var classrooms = require('../../app/controllers/classrooms');

  var professor = users.hasAuthorization(['professor']);

  // Classrooms Routes
  app.route('/classrooms')
    .get(professor, classrooms.list)
    .post(professor, classrooms.create);

  app.route('/classrooms/:classroomId')
    .get(professor, classrooms.read)
    .put(professor, classrooms.hasAuthorization, classrooms.update)
    .delete(professor, classrooms.hasAuthorization, classrooms.delete);

  // Finish by binding the Classroom middleware
  app.param('classroomId', classrooms.classroomByID);
};
