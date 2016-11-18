'use strict';

var sequelize = require('../config/initializers/database')();
var models = require('../app/models/index')(sequelize);

module.exports = {
  up: function (queryInterface) {
    return models.skill
    .build({ name: 'Skill1' })
    .save()
    .then( function (baseSkill) {
      var shifts = [];
      for (var i = 0 ; i < 5 ; i++) {
        shifts.push({
          name: 'Day '+i,
          workHours: 8.0,
          penaltyRate: 1.0,
          numberOfWorkers: 1,
          shiftWeight: 1,
          starts: new Date(1469347200000+(i*1000*3600*24)),
          finishes: new Date(1469376000000+(i*1000*3600*24)),
          leadIn: 0.0,
          lagOut: 0.0,
          skillId: baseSkill.id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      return queryInterface.bulkInsert('shifts',shifts,{})
      .then( function () {
        var workers = [{ name: 'Worker 1',
          basePayRate: 17.98,
          minHours: 0,
          maxHours: 600,
          minShifts: 0,
          maxShifts: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { name: 'Worker 2',
          basePayRate: 19.07,
          minHours: 0,
          maxHours: 600,
          minShifts: 0,
          maxShifts: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }];
        return queryInterface.bulkInsert('workers', workers,{})
        .then( function() {
          // retrieve the workers
          return models.worker.findAll()
          .then(function(workersCreated) {
            // retrieve the skill categories
            return models.skill.findAll()
            .then(function(skillsCreated) {
              var workerSkills = [];
              workersCreated.forEach( function(worker) {
                skillsCreated.forEach( function(skill) {
                  workerSkills.push({
                    minShifts: 0,
                    maxShifts: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    skillId: skill.id,
                    workerId: worker.id
                  });
                });
              });
              return queryInterface.bulkInsert('workerSkills',workerSkills,{});
            });
          });
        });
      });
    });
  },

  down: function (queryInterface) {
    console.log('Dropping');
    queryInterface.dropAllTables()
    .then(function() {
      console.log('Completed successfully');
      process.exit();
    })
    .catch(function(error) {
      console.error(error.stack);
      process.exit(1);
    });
  }
};
