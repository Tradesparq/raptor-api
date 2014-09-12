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

app.use(function(req,res,next) {
  console.log("request" + req.method + " to " + req.url);
  next();
})

app.use(function(req,res,next) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello");
})

app.listen(3000);


var Sequelize = require('sequelize')
    ,sequelize = new Sequelize('market', 'postgres', '123456', {
      dialect: "postgres",
      port: 5432
    })
sequelize
  .authenticate()
  .complete(function(err) {
    if(!!err) {
      console.log('err',err)
    } else {
      console.log('success')
    }
  })

sequelize
  .sync({ force: true })
  .complete(function(err) {
     if (!!err) {
       console.log('An error occurred while creating the table:', err)
     } else {
       console.log('It worked!')
     }
  })
var User = sequelize.define('User', {
  username: Sequelize.STRING,
  password: Sequelize.STRING
}, {
  tableName: 'market_product', // this will define the table's name
  timestamps: false           // this will deactivate the timestamp columns
})
User
  .find({where: { id: '2'}})
  .complete(function(err, item) {
    if (!!err) {
      console.log('An error occurred while searching:', err)
    } else if (!item) {
      console.log('Not found.')
    } else {

      console.log('market_id :', item.values.market_id)
    }
  })

app.get('/id/:id', function(req,res) {
    res.send(function() {
    
    })
  })
