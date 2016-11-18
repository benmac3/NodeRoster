'use strict';
var sequelize = require('../config/initializers/database')();
var models = require('../app/models/index')(sequelize);

//var models = require('../app/models');
//models.sequelize.sync().then(function() {
sequelize.sync().then(function() {
  console.log('Completed successfully');
  process.exit();
});
