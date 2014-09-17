var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var solrProductClient = require('ts-solr-client').createCore('market-product').createClient(config.solr);

exports.search = function (req, res) {
  if (!req.query.params) {
    return res.status(400).send('params not define');
  }

  var params;
  try {
    params = JSON.parse(req.query.params);
  } catch (err) {
    return res.status(400).send(err);
  }

  params.start = params.start || 0;
  params.rows = params.rows || 20;
  solrProductClient.search(params, function (err, data) {
    if (err) {
      console.log('solrProductClient', err);
      return res.status(400).send(err);
    }

    res.send(data);
  });
};
