var Rest = require('./rest');
var sequelize = require('../config/sequelize');
var model = sequelize.import(__dirname + '/../models/market_seller');
var schema = require('../schema/market_product');
var rest = new Rest({model: model, schema: schema});

exports.search = function(req, res) {
  console.log('search')
  rest.search(req, res);
};
exports.retrieve = function(req, res) {
  console.log('retrieve')
  rest.retrieve(req, res);
};
