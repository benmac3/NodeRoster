"use strict";

module.exports = function(sequelize, DataTypes) {
  var Shift = sequelize.define('shift', {
    name: { type: DataTypes.STRING, allowNull: false },
    workHours: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false },
    penaltyRate: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false },
    numberOfWorkers: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false },
    shiftWeight: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false},
    starts: { type: DataTypes.DATE, allowNull: false },
    finishes: { type: DataTypes.DATE, allowNull: false },
    leadIn: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false },
    lagOut: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false }
  }, {
    classMethods: {
      associate: function(models) {
        // This feels a little odd but it does create the correct behavior of adding the FK to the Shift table rather than the Skill table
        Shift.belongsTo(models.skill)
      }
    }
  });
  return Shift;
};
