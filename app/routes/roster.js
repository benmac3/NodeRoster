module.exports = (function() {
  'use strict';
  var router = require('express').Router();
  router.get('/roster',function(req, res) {
    var models = require('../models');
    var shift = models.shift;
    var worker = models.worker;
    var workerSkill = models.workerSkill;
    shift.findAll()
    .then(function(result) {
      var shifts = result;
      worker.findAll({include: [{model: workerSkill}]})
      .then(function(result) {
        res.json({'shifts':shifts,'workers':result});
      });
    });
  });
  return router;
})();
