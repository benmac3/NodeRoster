"use strict";

module.exports = function(sequelize, DataTypes) {
  var WorkerTimeoff = sequelize.define('workerTimeoff', {
    starts: { type: DataTypes.DATE, allowNull: false },
    finishes: { type: DataTypes.DATE, allowNull: false },
  });
  return WorkerTimeoff;
};
