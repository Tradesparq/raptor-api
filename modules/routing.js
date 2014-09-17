var fs = require('fs');

/**
 * Method to load routes from path
 *
 * @param  {String} path
 * @param  {Object} app
 * @param  {Object} passport [NOTICE: maybe used in api.tradesparq.com]
 *
 * @return {null}
 *
 * @author Jimmy (2013-07-17)
 */
module.exports = function(path, app, passport) {
	// fs.readdirSync(path).forEach(function(file) {
	// 	if (process.env.DEBUG_CONSOLE == 'true') console.log('require route %s/%s', path, file);
	// 	// require(path + '/' + file);
	// 	require(path + '/' + file)(app, passport);
	// });
	require('../routes/market_product')(app, passport)
	require('../routes/market_seller')(app, passport)
	require('../routes/search')(app, passport)
};
