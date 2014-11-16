'use strict';

require('./config/init')();

var config = require('./config/config');

require('./config/mongo')(config);

// Init the express application
var app = require('./config/express')();

// Bootstrap passport config
require('./config/passport')();

require('./app/tasks').init();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);