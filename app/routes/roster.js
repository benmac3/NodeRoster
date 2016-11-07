
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
    createRoster(models, function(engine_request) {
        //res.json({'shifts':shifts,'workers':result.map(mapWorkers)});
      var post_data = JSON.stringify(engine_request);

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
          //  take the result which has IDs for the shift and worker objects and replace them with
          //  full objects.  There is some duplication of objects but the response has sufficient
          //  information to serve the GUI without the need for multiple requests which ould result
          //  in a dirty records being included
          var arrayToHash = function (a,b) { a[b.id]=b; return a; };
          var shiftMap = engine_request.shifts.reduce(arrayToHash ,{});
          var workerMap = engine_request.workers.reduce(arrayToHash ,{});
          var serverResp = JSON.parse(body);
          var hydrate = function(a,b) {
            a.push({
              shift: shiftMap[b.shiftId],
              worker: workerMap[b.workerId]
            });
            return a;
          };
          var firstRosterHydrated = serverResp.firstRosterSolution.reduce(hydrate ,[]);
          var minCostRosterHydrated = serverResp.minCostRosterSolution.reduce(hydrate ,[]);
          serverResp.firstRosterSolution = firstRosterHydrated;
          serverResp.minCostRosterSolution = minCostRosterHydrated;
          res.json(serverResp);
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
