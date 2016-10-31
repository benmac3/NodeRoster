var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../config/config.json')[env];
var logger    = require('winston');

'use strict';

logger.info('[DATABASE] Sequelize initializing connection');

// setup a connection pool
var sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

logger.info('[DATABASE] Complete');

module.exports = sequelize;
