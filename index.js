'use strict';

var logger = require('winston');

logger.info('[APP] Starting Roster initialization');

// sequelize does not require connections to be initialized to return cleanly
//   It appears to spin up the pool at request time therefore async behavior is
//   not required.
var sequelize = require('./config/initializers/database')();
var models = require('./app/models/index')(sequelize);

var app = require('./config/initializers/server')();
require('./config/initializers/restResources')(sequelize, app);
require('./app/routes/index')(app, models);

var port = process.env.PORT || 9001;
app.listen(port, function() {
  logger.info('Server listening at %s', port);
  logger.info('[APP] Roster initialized SUCCESSFULLY');
});
