'use strict';

var express = require('express');
var cors = require('cors');
var morgan = require('morgan'); //logging
var bodyParser = require('body-parser');
//var Sequelize = require('sequelize');
var epilogue = require('epilogue');
var models = require('./app/models');
var roster = require('./app/routes/roster');
var app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;

// middleware to use for all requests
app.use(function(req, res, next) {
  // do logging
  console.log(req.body);
  // make sure we go to the next routes and don't stop here
  next();
});

// Route to generate inputs to rostering engine.
app.use('/api', roster);

// Initialize epilogue
epilogue.initialize({
  app: app,
  base: '/api',
//  sequelize: database
  sequelize: models.sequelize
});

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
  endpoints: ['/workers', '/workers/:id', '/workers/:id/skills', '/workers/:id/workerTimeoff']
});


app.listen(port, function() {
  console.log('listening at %s', port);
});
