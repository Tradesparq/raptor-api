var Rest = require('../controllers/rest');
var sequelize = require('../config/sequelize');
var model = sequelize.import(__dirname + '/../models/market_seller');
var schema = require('../schema/market_seller');
var rest = new Rest({model: model, schema: schema});
module.exports = function(app, passport) {

	app.post('/market_seller', rest.create.bind(rest));
	app.get('/market_seller/:id', rest.retrieve.bind(rest));
	app.put('/market_seller/:id', rest.update.bind(rest));
	app.del('/market_seller/:id', rest.destroy.bind(rest));

	app.get('/market_seller', rest.search.bind(rest));
};
