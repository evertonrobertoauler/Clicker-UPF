'use strict';

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		mochaTests: ['tests/**/*.js', '!tests/_init_db.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverJS: {
				files: watchFiles.serverJS.concat(watchFiles.mochaTests),
				tasks: ['jshint'],
			}
		},
		jshint: {
			all: {
        src: watchFiles.serverJS.concat(watchFiles.mochaTests),
				options: {
					jshintrc: true
				}
			}
		},
		nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverJS
        }
      },
      socket: {
        script: 'socket.js'
      },
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 5858,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		concurrent: {
			default: ['nodemon:dev', 'watch'],
      debug: ['nodemon:dev', 'watch', 'node-inspector'],
      socket: ['nodemon:socket'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: ['server.js']
			}
		}
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Socket.io task.
  grunt.registerTask('socket.io', ['lint', 'concurrent:socket']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint']);

	// Test task.
	grunt.registerTask('test', ['lint', 'env:test', 'initDb', 'mochaTest']);

  grunt.registerTask('initDb', function() {
    require('./tests/_initDb')(grunt, this.async());
  });
};
