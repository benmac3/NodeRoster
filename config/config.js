// I would have preferred to break this into a db and generator_service config section
//  but the Sequelize seeding scripts expect the format of the config
//  object to have username/password/database etc at the top level.
// Also, I'd name generator_service engine previously.  This actually overrode
//  the engine (ISAM, innodb) causing SQL operations to fail when a JSON object
//  was passed as part of the arguments.
module.exports = {
  'development': {
    'username': 'roster',
    'password': 'roster',
    'database': 'roster',
    'host': '127.0.0.1',
    'dialect': 'mysql',
    'generator_service': {
      'host': '127.0.0.1',
      'port': '8080'
    }
  },
  'docker': {
    'username': process.env.ROSTER_DB_USER,
    'password': process.env.ROSTER_DB_PASSWORD,
    'database': process.env.ROSTER_DB_NAME,
    'host': process.env.ROSTER_DB_HOST,
    'dialect': 'mysql',
    'generator_service': {
      'host': process.env.ROSTER_ENGINE_HOST,
      'port': process.env.ROSTER_ENGINE_PORT
    }
  }
};
