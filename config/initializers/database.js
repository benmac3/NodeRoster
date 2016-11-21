var Sequelize = require('sequelize');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../config/config.js')[env];
var logger    = require('winston');

function database() {
  'use strict';

  logger.info('[DATABASE] Sequelize initializing connection');

  logger.info(env);

  logger.info(config);
  // TODO: clean this up so it just uses localhost for everything (bare metal dev) or Docker
  var sequelize =new Sequelize(config.database, config.username, config.password, config);

  logger.info('[DATABASE] Complete');

  return sequelize;
}
module.exports = database;
