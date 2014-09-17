var express = require('express');
var cors = require('./middlewares/cors');

module.exports = function(app, config) {
  // configure
  app.configure(function() {
    // set port
    app.set('port', process.env.PORT || config.port);

    // Remove the x-powerd-by header
    app.disable('x-powered-by');

    // TODO: config session store engine in the config.sessStoreEngine [memory, mongodb, redis, mysql]
    // init a session list obj in the memory
    // app.set('sess', {});

    // connect.favicon(__dirname + '/public/favicon.ico') ignore the request if no favicon.ico ?
    app.use(express.favicon());
    // the very first middleware logging every request
    app.use(express.logger('dev'));

    // bodyParser should be above methodOverride
    app.use(express.bodyParser()); // parser the POST data into req.body as an object
    app.use(express.methodOverride());

    // parser the cookie header field and populates req.cookies with an object keyed by the cookie names
    // cookieParser should be above session
    app.use(express.cookieParser(config.secret));
    // app.use(express.session({
    //   secret: config.secret,
    //   // store: ...,
    //   cookie: {
    //     maxAge: 600000
    //   } // TODO: change to 60000 ?
    // }));

    // use passport session
    // app.use(passport.initialize());
    // app.use(passport.session());
    //
    app.use(cors);

    app.use(app.router);

    // app.enable('strict routing');
    // app.use(express.static(config.public)); // path.join(config.root, '../client/app')


    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next) {
      // treat as 404
      if (~err.message.indexOf('not found')) return next();

      // log it
      console.error(err.stack);

      // error page
      res.send(500, 'Internal Server Error.');
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next) {
      // TODO: show 404, resource not found?
      res.send(404, 'Not Found.');
    });
  });

  // configure development environment error handler
  app.configure('development', function() {
    // dumpExceptions, showStack
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  // configure production environment error handler
  app.configure('production', function() {
    app.use(express.errorHandler());
  });
};
