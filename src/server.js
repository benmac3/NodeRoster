
var express = require('express');
var cors = require('cors');
var morgan = require('morgan'); //logging
var bodyParser = require('body-parser');
//var Sequelize = require('sequelize');
var epilogue = require('epilogue');
var models = require("../models");

var app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9001;
var router = express.Router();


// middleware to use for all requests
app.use(function(req, res, next) {
    // do logging
    console.log('In server.js');

       console.log(req.body);
    // make sure we go to the next routes and don't stop here
    next();
});

// Initialize epilogue
epilogue.initialize({
  app: app,
  base: '/api',
//  sequelize: database
  sequelize: models.sequelize
});

// Create REST resource
var skillResource = epilogue.resource({
//  model: Skill,
  model: models.skill,
  endpoints: ['/skills', '/skills/:id']
});

var shiftResource = epilogue.resource({
  //model: Shift,
  model: models.shift,
  endpoints: ['/shifts', '/shifts/:id']
});

var workerResource = epilogue.resource({
  //model: Shift,
  model: models.worker,
  associations: true,
  endpoints: ['/workers', '/workers/:id', '/workers/:id/skills', '/workers/:id/workerTimeoff']
});


// Create database and listen
models.sequelize
  .sync({ force: false })
  .then(function() {
    app.listen(port, function() {
      console.log('listening at %s', port);
    });
  });
