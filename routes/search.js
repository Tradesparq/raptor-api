var solr = require('../controllers/solr');
var casper = require('../controllers/casper')
module.exports = function(app, passport) {
  app.get('/search', solr.search.bind(solr));
  app.get('/casper', casper.search)
};
