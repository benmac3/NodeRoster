var epilogue = require('epilogue');
var changeCase = require('change-case');
var express = require('express');
var logger = require('winston');
var routes = require('require-dir')();

module.exports = function(app, models) {
  logger.info('[SERVER] Initializing routes');

  'use strict';

  // Create REST resource
  epilogue.resource({
    model: models.skill,
    endpoints: ['/skills', '/skills/:id']
  });

  epilogue.resource({
    model: models.shift,
    endpoints: ['/shifts', '/shifts/:id']
  });

  epilogue.resource({
    model: models.worker,
    associations: true,
    endpoints: ['/workers', '/workers/:id', '/workers/:id/workerSkills','/workers/:id/workerTimeoff'],
    exclude: [{
      model: models.skill
    }]
  });

  epilogue.resource({
    model: models.workerSkill,
    associations: true,
    endpoints: ['/workerSkills', '/workerSkills/:id']
  });

  // Initialize all routes
  Object.keys(routes).forEach(function(routeName) {
    var router = express.Router();
    // You can add some middleware here
    // router.use(someMiddleware);

    // Initialize the route to add its functionality to router
    require('./' + routeName)(router,models);

    // Add router to the speficied route name in the app
    logger.info('Adding:'+'/api/' + changeCase.paramCase(routeName));
    app.use('/api/' + changeCase.paramCase(routeName), router);
  });
  logger.info('[SERVER] Route initialization complete');

};
