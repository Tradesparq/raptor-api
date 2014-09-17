var Rest = require('../controllers/rest');
var sequelize = require('../modules/sequelize').get('db1');
var model = sequelize.import(__dirname + '/../models/market_product');
var schema = require('../schema/market_product');
var rest = new Rest({model: model, schema: schema});
module.exports = function(app, passport) {

	app.post('/market_product', rest.create.bind(rest));
	app.get('/market_product/:id', rest.retrieve.bind(rest));
	app.put('/market_product/:id', rest.update.bind(rest));
	app.del('/market_product/:id', rest.destroy.bind(rest));

	app.get('/market_product', rest.search.bind(rest));
};
