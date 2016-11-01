
var logger = require('winston');
var http = require('http');

module.exports = function(router,models) {
  'use strict';

  // return the JSON request being sent to the roster engine...
  router.get('/request', function(req, res) {
    createRoster(models, function(result) {
      res.json(result);
    });
  });

  // retrieve the Roster solution based on the JSON request...
  router.get('/solution', function(req, res) {
    createRoster(models, function(result) {
        //res.json({'shifts':shifts,'workers':result.map(mapWorkers)});
      var post_data = JSON.stringify(result);

      var post_options = {
        host: 'localhost',
        port: '8080',
        path: '/WebRoster/roster',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      var post_req = http.request(post_options, function(resp) {
        var body = '';
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
          //console.log('Response: ' + chunk);
          body += chunk;
        });
        resp.on('end', function() {
          res.json(JSON.parse(body));
        });
      });
      post_req.write(post_data);
      post_req.end();
    });
  });

  return router;
};

function createRoster(models,callback) {
  var shift = models.shift;
  var worker = models.worker;
  var workerSkill = models.workerSkill;
  shift.findAll()
  .then(function(result) {
    var shifts = result.map(mapShifts);
    worker.findAll({include: [{model: workerSkill}]})
    .then(function(result) {
      callback({'shifts':shifts,'workers':result.map(mapWorkers),'fixedShiftWorkers':[]});
    });
  });
}

function mapShifts(shift) {
  return {
    id: shift.id,
    displayName: shift.name,
    workHours: shift.workHours,
    penaltyRate: shift.penaltyRate,
    numberOfWorkers: shift.numberOfWorkers,
    shiftWeight: shift.shiftWeight,
    starts: Date.parse(shift.starts),
    finishes: Date.parse(shift.finishes),
    leadIn: shift.leadIn,
    lagOut: shift.lagOut,
    category: shift.skillId
  };
}

function mapWorkers(worker) {
  return {
    id: worker.id,
    displayName: worker.name,
    availablePeriods: [{
      availableFrom: 0,
      availableTill: 4102444800000
    }],
    basePayRate: worker.basePayRate,
    minHours: worker.minHours,
    maxHours: worker.maxHours,
    minShifts: worker.minShifts,
    maxShifts: worker.maxShifts,
    shiftCategories: worker.workerSkills.map(mapWorkerSkills),
  };
}

function mapWorkerSkills(ws) {
  return {
    categoryId: ws.skillId,
    minShiftsOfCategory: ws.minShifts,
    maxShiftsOfCategory: ws.maxShifts
  };
}
