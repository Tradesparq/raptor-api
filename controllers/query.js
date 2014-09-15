var market = require('../modules/sequelize')
var q = {
  searchProduct : function (query,callback){
      market.product
        .findAll({
          where: {
            id:{
              lte:5
            }
          }
        })
        .success(function(myTableRows) {
          callback(null, myTableRows)
        })
        .error(function(err) {
          callback(err)
        })
  },
  searchSeller : function (query,callback){
      market.seller
        .findAll({
          where: {
            id:{
              lte:5
            }
          }
        })
        .success(function(myTableRows) {
          callback(null, myTableRows)
        })
        .error(function(err) {
          callback(err)
        })
  }


}

module.exports = q;

// searchProduct : function ( id , callback){
//     sequelize
//       .query("SELECT * FROM market_product WHERE id = "+id)
//       .success(function(myTableRows) {
//         callback(null, myTableRows)
//       })
//       .error(function(err) {
//         callback(err)
//       })
// },
