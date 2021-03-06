var http = require('http');
var app = require('express')();
var passport = require('passport');
var routes = require('./routes');
var user = require('./modules/sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var logger = require('./helper/log_helper').getLogger('app');
logger.setLevel('INFO');
// set a global variable to control debug
process.env.DEBUG_CONSOLE = config.debug; // some npm modules used the DEBUG variable


app.use(function(req,res,next) {
  logger.info("request" + req.method + " to " + req.url);
  next();
})
// express settings
require('./config/express')(app, config); // , sequelize, passport


var routes_path = __dirname + '/routes';
require('./modules/routing')(routes_path, app);
http.createServer(app).listen(app.get('port'), function() {
    logger.info("Express server listening on port " + app.get('port'));
    // console.timeEnd('Elapsed Time');
  });
