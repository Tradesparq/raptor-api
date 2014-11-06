var solr = require('../controllers/solr');
var searchOnline = require('../controllers/searchOnline')
module.exports = function(app, passport) {
  app.get('/search', solr.search.bind(solr));
  app.get('/search-online', searchOnline.search)
};
