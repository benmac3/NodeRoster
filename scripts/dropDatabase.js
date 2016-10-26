var models = require("../models");
models.sequelize.drop().then(function() {
  console.log("Completed successfully");
  process.exit();
});
