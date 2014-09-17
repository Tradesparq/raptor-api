var solr = require('../controllers/solr');
module.exports = function(app, passport) {
  app.get('/search', solr.search.bind(solr));
};
