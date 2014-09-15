// var seq = require('/modules/sequelize')
var Sequelize = require('sequelize')
var sequelize = require('../config/sequelize')
sequelize
  .authenticate()
  .complete(function(err) {
    if(!!err) {
      console.log('err',err)
    } else {
      console.log('success')
    }
  })


  // var User = sequelize.define('User', {
  //   username: Sequelize.STRING,
  //   password: Sequelize.STRING
  // }, {
  //   tableName: 'market_product', // this will define the table's name
  //   timestamps: false           // this will deactivate the timestamp columns
  // })
  //
  // module.exports = User
module.exports = {
  product : sequelize.import("../models/market_product.js"),
  seller : sequelize.import("../models/market_seller.js")
}
