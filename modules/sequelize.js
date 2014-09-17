// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

/**
 * Class singleton
 */
var singleton = function singleton() {
  var instances = {};

  this.set = function(dbNum) {
    if (config.db[dbNum] === undefined) {
      throw new Error("There is no \"" + dbNum + "\" in the db config file");
    }
    instances[dbNum] = require('../config/sequelize')(config.db[dbNum]);
  };

  this.get = function(dbNum) {
    if (instances[dbNum] === undefined) {
      this.set(dbNum);
    }
    return instances[dbNum];
  };

  this.getInstances = function() {
    return instances;
  };
};

/**
 * SINGLETON CLASS DEFINITION
 */
singleton.instance = null;

/**
 * get singleton instance
 */
singleton.getInstance = function() {
  if (this.instance === null) {
    this.instance = new singleton();
  }
  return this.instance;
};

/**
 * eg.
 * var sequelize = require('./modules/sequelize').get('db1');
 */
module.exports = singleton.getInstance();
