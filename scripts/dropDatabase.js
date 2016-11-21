'use strict';
var sequelize = require('../config/initializers/database')();
var models = require('../app/models/index')(sequelize);

//var models = require('../app/models');
//models.sequelize.drop().then(function() {
sequelize.drop().then(function() {
  console.log('Completed successfully');
  process.exit();
}).catch(function (err) {
  // Rolled back
  console.error(err);
});
