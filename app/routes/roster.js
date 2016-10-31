var logger = require('winston');

module.exports = function(router,models) {
  'use strict';
  logger.info('Adding roster');
  router.get('/',function(req, res) {
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
};
