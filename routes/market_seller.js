var market_seller = require('../controllers/market_seller.js');

module.exports = function(app, passport) {

	app.get('/market_seller/:id', market_seller.retrieve);

	app.get('/market_seller', market_seller.search);
};
