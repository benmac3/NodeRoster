'use strict';

var path      = require('path');
var modelFiles= require('require-dir')();
var logger    = require('winston');

function initModels(sequelize) {
  var models = {};
  Object.keys(modelFiles).forEach(function(file) {
    logger.debug(file);
    var model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

  Object.keys(models).forEach(function(modelName) {
    logger.debug(modelName);
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  return models;
}

module.exports = initModels;
