exports.search = function (req, res) {
var keyword = JSON.parse(req.query.params).q;
var child = require('child_process');
var async = require('async');
var source = ['Aliexpress', 'Dhgate', 'Tradetang'];
var logger = require('../helper/log_helper').getLogger('controllers-casper');
logger.setLevel('INFO');
var data = {};
logger.info('search '+keyword)
source.forEach(function(item) {
  data[item] = [];
})
logger.info('start');
async.map(source, function(item, cb) {
  child.exec('casperjs controllers/casper/reaper.casper.js ' + item + ' "' + keyword + '"', function(err, stdout, stderr) {
    logger.info(item+'finish');
    if(err || stderr) {
      logger.error(err||stderr)
      cb(null, {result:[]});
    } else if(JSON.parse(stdout).error) {
      logger.error(JSON.parse(stdout).error)
      cb(null, {result:[]});
    } else{
      cb(null, JSON.parse(stdout));
    }
  })
}, function(err, arr) {
  logger.info('end');
  source.forEach(function(item, index) {
    if(typeof(arr[index].result) == 'undefined') {
      return {
        doclist: {
          docs: [
            {}
          ]
        }
      }
    }
    else {
      var len = arr[index].result.length<=20?arr[index].result.length:20;
      for (var i = 0;i< len; i++) {
        data[item][i] = {
          doclist: {
            docs: [
              arr[index].result[i]
             ]
          }
        }
      }
    }
  })
  res.send(200, data);
});

}
