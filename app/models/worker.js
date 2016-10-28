'use strict';

module.exports = function(sequelize, DataTypes) {
  var Worker = sequelize.define('worker',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      basePayRate: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false },
      minHours: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false},
      maxHours: { type: DataTypes.DOUBLE, validate: { min: 0 }, allowNull: false},
      minShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false },
      maxShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false }
    },
    {
      classMethods: {
        associate: function(models) {
          Worker.hasMany(models.workerTimeoff);
          Worker.hasMany(models.workerSkill);
        }
      }
    });
  return Worker;
};
