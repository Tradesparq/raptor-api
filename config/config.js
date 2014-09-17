var path = require('path');

/**
 * App Config
 */
module.exports = {
  development: {
    debug: true,
    port: 3000,
    root: path.normalize(__dirname + '/..'),
    secret: '54qe3w0q41',
    host: 'http://localhost:3000/',
    solr: {
      host: '192.168.11.202',
      port: '8983',
      path: '/solr'
    },
    db: {
        db1: {
          host: '192.168.11.202',
          name: 'market',
          user: 'customs',
          pass: 'trade11235',
          dialect: 'postgres',
          port: 5432,
          logging: true
        }
      }
    /*,
      facebook: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      twitter: {
          clientID: "CONSUMER_KEY"
        , clientSecret: "CONSUMER_SECRET"
        , callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
          clientID: 'APP_ID'
        , clientSecret: 'APP_SECRET'
        , callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID"
        , clientSecret: "APP_SECRET"
        , callbackURL: "http://localhost:3000/auth/google/callback"
      }*/

  },

  test: {

  }
};
