"use strict";

module.exports = function(sequelize, DataTypes) {
  var WorkerSkill = sequelize.define('workerSkill', {
    minShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false },
    maxShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false }
  });
  return WorkerSkill
};
