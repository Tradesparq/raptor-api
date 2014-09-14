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
// var routes = require('routes');
var user = require('./modules/sequelize');
app.use(function(req,res,next) {
  console.log("request" + req.method + " to " + req.url);
  next();
})

// app.use('/',function(req,res,next) {
//   res.writeHead(200, {"Content-Type": "text/plain"});
//   res.end("Hello");
// })

app.listen(3000);



function searchById (id){

    user
      .find({where: { 'id': id}})
      .complete(function(err, item) {
        if (!!err) {
          return('error', err)
        } else if (!item) {
          return('Not found.')
        } else {

          return('val',item.values.val)
        }
      })




}


app.get('/id/:id', function(req,res) {
    res.send(searchById(req.param('id')));
  })
