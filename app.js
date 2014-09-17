// var http = require('http');
// var env = process.env.NODE_ENV || 'development';
// var config = require('./config/config')[env];
// var app = require('express')();
// require('./config/express')(app, config);
// var routes_path = __dirname + '/routes';
// require('./modules/routing')(routes_path, app);
// http.createServer(app).listen(app.get('port'), function() {
//   console.log("Express server listening on port "+ app.get('port'));
//   console.timeEnd('Elapsed Time');
// })

var http = require('http');
var app = require('express')();
var passport = require('passport');
var routes = require('./routes');
var user = require('./modules/sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
// set a global variable to control debug
process.env.DEBUG_CONSOLE = config.debug; // some npm modules used the DEBUG variable


app.use(function(req,res,next) {
  console.log("request" + req.method + " to " + req.url);
  next();
})
// express settings
require('./config/express')(app, config); // , sequelize, passport

// app.use('/',function(req,res,next) {
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end("Hello");
// })
var routes_path = __dirname + '/routes';
require('./modules/routing')(routes_path, app);
http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
    // console.timeEnd('Elapsed Time');
  });

// app.get('/market_product/',routes.searchProduct);
// app.get('/market_seller/',routes.searchSeller);
// app.get('/src/:src',routes.searchBySource);
// app.get('/mId/:mId',routes.searchByMarketId);
// app.get('/all?where id < asda and XXXXX',routes.searchAll);
//

// '/market_product?fields=id,source,asdasd&where="sdasd"'
