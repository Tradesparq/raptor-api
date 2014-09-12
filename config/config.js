var path = require('path');
module.exports = {
  development: {
    debug: true,
    port: 3030,
    root: path.normalize(__dirname + '/..'),
    secret: '54qe3w0q41',
    host: 'http://localhost:3030/',
    db: {
      db1: {
        host: '127.0.0.1',
        name: 'customs',//market
        user: 'customs',
        pass: '123456',
        dialect: 'postgres',
        port: 3306,
        logging: true
      }
    }
  }
};
