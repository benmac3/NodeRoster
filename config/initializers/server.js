// config/initializers/server.js

var express = require('express');
var path = require('path');
var cors = require('cors');
// Local dependecies

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

'use strict';
// Configure express
app = express();

app.use(morgan('common'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: '*/*'}));

logger.info('[SERVER] Initializing routes');
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

//var port = process.env.PORT || 9001;
//app.listen(port);
//app.listen(config.get('NODE_PORT'));
//logger.info('[SERVER] Listening on port ' + port);


module.exports = app;
