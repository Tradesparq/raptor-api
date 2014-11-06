var log4js = require('log4js');
log4js.configure({
    "appenders": [
      {
        "type": "console",
        "layout": {
          "type": "pattern",
          "pattern": "%[%d{yyyy-MM-dd hh:mm:ss.SSS} %p %x{program} %c -%] %m",
          "tokens": {
            "pid" : function() { return process.pid; },
            "program": "raptor-api"
          }
        }
      }
    ]
  });

module.exports = log4js;
