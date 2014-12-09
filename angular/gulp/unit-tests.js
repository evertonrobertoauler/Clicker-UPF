'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

gulp.task('karma', ['karma:src']);

gulp.task('karma:src', function() {
  var bowerDeps = wiredep({
    directory: 'bower_components',
    exclude: ['bootstrap-sass-official'],
    dependencies: true,
    devDependencies: true
  });

  var testFiles = bowerDeps.js.concat([
    'src/**/*.js',
    '!src/**/*.e2e.js',
  ]);

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('karma:dist', ['build'], function() {

  var testFiles = [
    'dist/scripts/modernizr*.js',
    'dist/scripts/vendor*.js',
    'dist/scripts/app*.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.spec.js',
  ];

  return gulp.src(testFiles)
    .pipe($.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});
