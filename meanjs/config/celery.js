'use strict';

module.exports = function(config) {

  var nodeCelery = require('node-celery');

  var celery = {
    runTask : function(name, params) {
      if (this.client) {
        this.client.call(name, params);
      }
    }
  };

  var client = nodeCelery.createClient({
    CELERY_BROKER_URL: config.rabbitmqUrl,
  });

  client.on('error', function(err) {
    console.error('\x1b[31m', 'Could not connect to RabbitMQ with Celery!');
    console.log(err);
  });

  client.on('connect', function() {
    celery.client = client;
  });

  config.celery = celery;
};