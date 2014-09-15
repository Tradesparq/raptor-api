var q = require('../controllers/query');
exports.searchProduct = function(req,res) {
  q.searchProduct(req.query,function (err, data) {
    if (err) {
      res.send(403, err)
    } else {
      res.send(data);
    }
  })
}
exports.searchSeller = function(req,res) {
  q.searchSeller(req.query,function (err, data) {
    if (err) {
      res.send(403, err)
    } else {
      res.send(data);
    }
  })
}


// exports.searchById = function(req,res) {
//   q.searchById(req.param('id'), function (err, data) {
//     if (err) {
//       res.send(403, err)
//     } else {
//       res.send(data);
//     }
//   })
// }
