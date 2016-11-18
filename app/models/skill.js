'use strict';

module.exports = function(sequelize, DataTypes) {
  var Skill = sequelize.define('skill',
    {
      name: DataTypes.STRING
    },
    {
      classMethods: {
        associate: function(models) {
          Skill.hasMany(models.shift);
          Skill.belongsToMany(models.worker, { through: models.workerSkill });
        }
      }
    });
  return Skill;
};
