// config/initializers/server.js

var express = require('express');
var path = require('path');
var cors = require('cors');
// Local dependecies

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app;

var start = function() {
  'use strict';
  // Configure express
  app = express();
  app.use(cors());
  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({type: '*/*'}));

  //require('../../app/routes/index')(app);

  app.use(express.static(path.join(__dirname, 'public')));

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });
  return app;
};

module.exports = start;
