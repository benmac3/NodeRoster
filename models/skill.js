"use strict";

module.exports = function(sequelize, DataTypes) {
  var Skill = sequelize.define('skill', {
    name: DataTypes.STRING
  }, {
      classMethods: {
        associate: function(models) {
          Skill.hasMany(models.shift)
          Skill.belongsToMany(models.worker, { as: 'Worker', through: 'workerSkill', foreignKey: 'skillId'})
        }
      }
    }
  );
  return Skill;
};
