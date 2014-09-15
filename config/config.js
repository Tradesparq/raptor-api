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
    host: 'http://localhost:3000/'
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
