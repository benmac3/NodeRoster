'use strict';

var models = require('../app/models');
models.sequelize.sync().then(function() {
  console.log('Completed successfully');
  process.exit();
});
