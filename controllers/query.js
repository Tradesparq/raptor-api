var sequelize = require('../config/sequelize')
var q = {
  searchById : function ( id ){
        sequelize
        .query("SELECT * FROM market_product WHERE ID = "+id).success(function(myTableRows) {
    console.log(myTableRows)
  })
  }
}

module.exports = q;
