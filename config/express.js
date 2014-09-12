var express = require('express');
var cors = require('./middlewares/cors');
module.exports = function(app, config) {
  app.configure(function(){
    app.set('port', process.env.PORT || config.port);
    app.disable('x-powered-by');
  })
}
