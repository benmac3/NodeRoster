'use strict';

module.exports = function(sequelize, DataTypes) {
  var WorkerSkill = sequelize.define('workerSkill',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true, unique: true },
      workerId: { type: DataTypes.INTEGER, references: { value: 'Worker', key: 'id' } },
      skillId: { type: DataTypes.INTEGER, references: { value: 'Skill', key: 'id' } },
      minShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false },
      maxShifts: { type: DataTypes.INTEGER.UNSIGNED, validate: { min: 0 }, allowNull: false }
    },
    {
      classMethods: {
        associate: function(models) {
          WorkerSkill.belongsTo(models.worker);
          WorkerSkill.belongsTo(models.skill);
        }
      }
    });
  return WorkerSkill;

};
