'use strict';

var schedule = require('node-schedule');
var mongoose = require('mongoose');
var moment = require('moment');
var Task = mongoose.model('Task');
var KnowledgeTest = mongoose.model('KnowledgeTest');
var queries = require('./queries');

var tasks = {};

tasks.openKnowledgeTest = function(id) {
  return queries.exec(KnowledgeTest.findById(id))
    .then(function(kt) {
      var now = moment().toDate();
      if (kt && kt.start <= now && kt.end >= now) {
        kt.open = true;
        return queries.exec(kt, 'save');
      }
    });
};

tasks.closeKnowledgeTest = function(id) {
  return queries.exec(KnowledgeTest.findById(id))
    .then(function(kt) {
      var now = moment().toDate();
      if (kt && kt.end <= now) {
        kt.open = false;
        return queries.exec(kt, 'save');
      }
    });
};

var scheduleJob = function(task) {
  schedule.scheduleJob(task.date, function() {
    tasks[task.name].apply(this, task.args)
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
  var task = new Task({name: name, args: args, date: date});
  queries.exec(task, 'save').then(scheduleJob);
};