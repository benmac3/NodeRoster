'use strict';
var models = require("../models");

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      var models = require("../models");

      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    //var skill = { name: 'Skill1', createdAt: new Date(), updatedAt: new Date() };
    //return queryInterface.bulkInsert('skills',[skill])
    return models.skill
      .build({ name: 'Skill1' })
      .save()
      .then( function (baseSkill) {
        var shifts = []
        for (var i = 0 ; i < 5 ; i++) {
          shifts.push(
            {     "name":"Day "+i,
                  "workHours":8.0,
                  "penaltyRate":1.0,
                  "numberOfWorkers":1,
                  "shiftWeight":1,
                  "starts": new Date(1469347200000+(i*1000*3600*24)),
                  "finishes": new Date(1469376000000+(i*1000*3600*24)),
                  "leadIn":0.0,
                  "lagOut":0.0,
                  "skillId":baseSkill.id,
                  "createdAt": new Date(),
                  "updatedAt": new Date()
            }
          )
        }
        return queryInterface.bulkInsert('shifts',shifts,{})
          .then( function (shiftsInserted) {
            var workers = [
              { name: "Worker 1",
                basePayRate: 17.98,
                minHours: 0,
                maxHours: 600,
                minShifts: 0,
                maxShifts: 10,
                createdAt: new Date(),
                updatedAt: new Date()
              },
              { name: "Worker 2",
                basePayRate: 19.07,
                minHours: 0,
                maxHours: 600,
                minShifts: 0,
                maxShifts: 10,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
            return queryInterface.bulkInsert('workers', workers,{})
              .then( function (workersInserted) {
                // retrieve the workers
                return models.worker.findAll()
                  .then(function(workersCreated) {
                    // retrieve the skill categories
                    return models.skill.findAll()
                      .then(function(skillsCreated) {
                        var workerSkills = []
                          workersCreated.forEach( function(worker) {
                            skillsCreated.forEach( function(skill) {
                              workerSkills.push({
                                minShifts: 0,
                                maxShifts: 10,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                skillId: skill.id,
                                workerId: worker.id
                              })
                            })
                          })
                          return queryInterface.bulkInsert('workerSkills',workerSkills,{})
                      })
                })
              }
            )
          })

        /*
        return models.shift
          .build()
          .save()
          .then( function(newShift) {
            console.log(newShift);
          })
          */
      }
  )
},

  down: function (queryInterface, Sequelize) {
    console.log("Dropping")
      queryInterface.dropAllTables()
        .then(function() {
          console.log("Completed successfully");
          process.exit();
        })
        .catch(function(error) {
          console.log("Bugger")
        })



      /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
