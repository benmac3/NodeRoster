'use strict';

var models = require('../app/models');
models.sequelize.drop().then(function() {
  console.log('Completed successfully');
  process.exit();
});
