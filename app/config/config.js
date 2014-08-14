var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

var config = {
  // Development Config
  //
  development: {
    server: {
      port: 3000,
      hostname: 'localhost',
    },
    database: {
      url: 'postgresql://127.0.0.1:5432',
      dbname: 'test'
    },
    root: rootPath
  },
  //
  // Production Config
  //
  production: {
    server: {
      port: process.env.OPENJS_PORT || 8080,
      hostname: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
    },
    database: {
      url: 'postgresql://$OPENSHIFT_POSTGRESQL_DB_HOST:$OPENSHIFT_POSTGRESQL_DB_PORT' || 'postgresql://127.0.0.1:5432',
      dbname: process.env.OPENSHIFT_APP_NAME || 'routingonosm'
    },
    root: rootPath
  },
  //
  // Test Config
  //
  test: {
    server: {
      port: 4001,
      hostname: 'localhost',
    },
    database: {
      // url: 'postgresql://127.0.0.1:5432',
      // table_name: 'parks'
      username: 'brandboat',
      password: '1234',
      dbname: 'test'
    }
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];