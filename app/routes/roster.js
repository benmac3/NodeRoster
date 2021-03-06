
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../config/config.js')[env]['generator_service'];
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


  // straight proxy of the response from the engine...
  router.get('/solution', function(req, res) {
    createRoster(models, function(engine_request) {
      createPost(engine_request, function(body) {
        res.json(JSON.parse(body));
      });
    });
  });





  // retrieve the Roster solution based on the JSON request...
  router.get('/clientSolution', function(req, res) {
    createRoster(models, function(engine_request) {
      createPost(engine_request, function(body) {
        //  take the result which has IDs for the shift and worker objects and replace them with
        //  full objects.  There is some duplication of objects but the response has sufficient
        //  information to serve the GUI without the need for multiple requests which ould result
        //  in a dirty records being included
        var arrayToHash = function (a,b) { a[b.id]=b; return a; };
        var shiftMap = engine_request.shifts.reduce(arrayToHash ,{});
        var workerMap = engine_request.workers.reduce(arrayToHash ,{});
        var serverResp = JSON.parse(body);
        var aggregateWorkers = function(a,b) {
          // if there is a record for the shift, append the record.
          if (a[b.shiftId]) {
            a[b.shiftId].push(b.workerId);
          // otherwise create the new record
          } else {
            a[b.shiftId]=[b.workerId];
          }
          return a;
        };

        var hydrate = function(roster) {
          var hydratedRoster = [];
          for (var key in roster) {
            var shift = shiftMap[key];
            var workerIds = roster[key];
            var workers = [];
            for (var i = 0 ; i<workerIds.length ; i++) workers.push(workerMap[workerIds[i]]);
            shift['workers']=workers;
            hydratedRoster.push(shift);
          }
          return hydratedRoster;
        };
        if (serverResp.numberOfSolutions>0) {
          var firstRoster = hydrate(serverResp.firstRosterSolution.reduce(aggregateWorkers, {}));
          var minCostRoster = hydrate(serverResp.minCostRosterSolution.reduce(aggregateWorkers, {}));
          serverResp.firstRosterSolution = {shifts: firstRoster};
          serverResp.minCostRosterSolution = {shifts: minCostRoster};
        }
        //setTimeout((function() {res.json(serverResp);}), 2000);
        res.json(serverResp);
      });
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

function createPost(request, callback) {
  var post_data = JSON.stringify(request);

  var post_options = {
    host: config['host'],
    port: config['port'],
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
      callback(body);
    });
  });
  post_req.write(post_data);
  post_req.end();
}
