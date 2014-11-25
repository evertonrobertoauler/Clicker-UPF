'use strict';

var schedule = require('node-schedule');
var mongoose = require('mongoose');
var moment = require('moment');
var Task = mongoose.model('Task');
var KnowledgeTest = mongoose.model('KnowledgeTest');
var Classroom = mongoose.model('Classroom');
var queries = require('./queries');
var _ = require('lodash');
var Q = require('q');

var tasks = {};

tasks.openKnowledgeTest = function* (id) {

  var kt = yield queries.exec(KnowledgeTest.findById(id));
  var classroom = yield queries.exec(Classroom.findById(kt && kt.classroom._id));
  var now = moment().toDate();

  if (classroom && kt && kt.start <= now && kt.end >= now) {
    var identity = function(u) { return u._id.toString(); };
    var all = kt.answers.concat(classroom.students);
    kt.answers = _.uniq(all, false, identity);
    kt.open = true;
    return queries.exec(kt, 'save');
  }
};

tasks.closeKnowledgeTest = function* (id) {
  var kt = yield queries.exec(KnowledgeTest.findById(id));
  var now = moment().toDate();
  if (kt && kt.end <= now) {
    kt.open = false;
    return queries.exec(kt, 'save');
  }
};

tasks.updateKnowledgeTestNumber = function* (date, professor, classroom) {

  var date1 = moment(date).startOf('day');
  var date2 = moment(date).add(1, 'day').startOf('day');

  var filter = {
    start: {$gte: date1.toDate(), $lt: date2.toDate()},
    'classroom._id': classroom,
    'professor._id': professor,
  };

  var knowledgeTests = yield queries.exec(KnowledgeTest.find(filter).sort('start _id'));
  var number = 0;

  return Q.all(knowledgeTests.map(function(kt){
    if (kt.number !== ++number) {
      kt.number = number;
      return queries.exec(kt, 'save');
    }
  }));
};

tasks.updateOpenKnowledgeTest = function* (classID) {
  var filter = {'classroom._id': classID, open: true};

  var promises = [
    queries.exec(Classroom.findById(classID)),
    queries.exec(KnowledgeTest.find(filter))
  ];

  var data = yield Q.all(promises);

  if (_.every(data)) {
    var classroom = data[0];
    var knowledgeTests = data[1];
    var identity = function(u) { return u._id.toString(); };

    return Q.all(knowledgeTests.map(function(kt) {
      var all = kt.answers.concat(classroom.students);
      kt.answers = _.uniq(all, false, identity);
      return queries.exec(kt, 'save');
    }));
  }
};

var scheduleJob = function(task) {
  schedule.scheduleJob(task.date, function() {
    Q.async(tasks[task.name]).apply(this, task.args)
      .then(function() {
        return queries.exec(task, 'remove');
      })
      .fail(function(err) {
        console.error(task, err);
      });
  });
};

exports.init = function() {
  queries.exec(Task.find()).then(function(tasks) {
    tasks.forEach(scheduleJob);
  });
};

exports.schedule = function(name, args, date) {
  var task = new Task({name: name, args: args, date: (date || moment())});
  queries.exec(task, 'save').then(scheduleJob);
};