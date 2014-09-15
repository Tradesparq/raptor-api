var market_product = require('../controllers/market_product.js');

module.exports = function(app, passport) {

	app.get('/market_product/:id', market_product.retrieve);

	app.get('/market_product', market_product.search);
};
