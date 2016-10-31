'use strict';

var epilogue = require('epilogue');

function initRestResources(sequelize,app) {
  return epilogue.initialize({
    app: app,
    base: '/api',
    sequelize: sequelize
  });
}
module.exports = initRestResources;
