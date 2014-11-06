exports.search = function (req, res) {

var keyword = JSON.parse(req.query.params).q
// console.log(req)
console.log('search '+keyword)
var child = require('child_process');
var async = require('async');
var source = ['Aliexpress', 'Dhgate', 'Tradetang'];
// var source = ['Tradetang'];
var fs = require('fs');
var start = new Date
var data = {}
source.forEach(function(item) {
  data[item] = []
})
console.log(new Date,'start')
async.map(source, function(item, cb) {
  child.exec('casperjs controllers/casper/reaper.casper.js ' + item + ' "' + keyword + '"', function(err, stdout, stderr) {
    console.log(new Date,item,'finish');
    if(err || stderr) {
      cb(null, {result:[]});
    } else if(stdout.error) {
      cb(null, {result:[]});
    } else{
      cb(null, JSON.parse(stdout));
      fs.writeFile(item+'.txt', stdout)
    }
  })
}, function(err, arr) {
  console.log(start,'start')
  console.log(new Date,'end')
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
      // data[item] = arr[index].result.map(function(item,i) {
      //   if(i < 20) {
      //     return {
      //       doclist: {
      //         docs: [
      //           item
      //          ]
      //       }
      //     }
      //   }
      // })
      var len = arr[index].result.length<=20?arr[index].result.length:20;
      for (var i = 0;i< 20; i++) {
        data[item][i] = {
          doclist: {
            docs: [
              arr[index].result[i]
             ]
          }
        }
      }
      // arr[index].result.some(function(ele,i) {
      //   data[item] = {
      //     doclist: {
      //       docs: [
      //         ele
      //        ]
      //     }
      //   }
      //   return i == 19;
      // })
    }
  })
  fs.writeFile('result.txt',JSON.stringify(data))
  res.send(200, data)
});

}
