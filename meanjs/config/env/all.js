'use strict';

var secret = require('fs').readFileSync('config/env/secret.pem');

module.exports = {
  url: '',
	app: {
		title: 'Open Peer Instruction',
		description: 'Peer Instruction method application.',
		keywords: '(MongoDB, Express, AngularJS, Node.js, Python, Celery)'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: secret,
  rabbitMQ: 'amqp://guest:guest@localhost:5672',
};