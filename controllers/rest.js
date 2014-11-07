var _ = require('underscore');
// var _.str = require('underscore.string');

// var  async = require('async');
var querystring = require("querystring");

var DEFAULT_PAGE_NUM = 1;
var DEFAULT_PAGE_SIZE = 20;
var logger = require('../helper/log_helper').getLogger('controllers-casper');
logger.setLevel('INFO');
// Base Rest Controller Class
var Rest = module.exports = function Rest(options) {
  options = options || {};
  this.model = options.model !== undefined ? options.model : null;
  this.schema = options.schema !== undefined ? options.schema : null;
  return this;
};

/**
 * Method to create a model
 *
 * app.post('/<models>', <models>.create);
 *
 * @param  {Object} req
 * @param  {Object} res
 *
 * @author Jimmy (2013-08-01)
 */
Rest.prototype.create = function(req, res) {
  // TODO: check permission


  // if (Object.getOwnPropertyNames(req.body).length > 0) {
  if (_.isEmpty(req.body)) {
    res.send(400, {
      error: {
        code: 103,
        message: "Empty data."
      }
    });
    return;
  }

  if (_.has(req.body, 'id')) {
    res.send(400, {
      error: {
        code: 102,
        message: "Contain invalid primary key id."
      }
    });
    return;
  }

  var schema = this._getSchema();

  var fields = _.keys(req.body);
  var invalidField = this._checkInvalidField(fields, schema);
  if (invalidField) {
    res.send(400, {
      error: {
        code: 101,
        message: "Invalid field: " + invalidField + "."
      }
    });
    return;
  }

  // TODO: 有些数据创建之前需要先检查是否已经存在如：用户?
  // 有些数据创建之前需要检查是否已经超过允许创建的最大值如：单个产品的图片?

  var model = this._getModel();
  model.create(req.body).success(function(data) {
    res.send(201, data);
    // res.send(201, {
    //  id: data.id,
    //  createdAt: "2011-08-20T02:06:57.931Z",
    // });
    // URL **returned in the location header**
    // Location: 'http://192.168.11.109:3030/<models>/' + data.id
  }).fail(function(err) {
    // TODO: log err and send warning email?
    logger.error('Rest.prototype.create', err);
    res.send(500, "Internal Server Error.");
  });
};

/**
 * Method to retrieve a model
 *
 * app.get('/<models>/:id', <models>.retrieve);
 *
 * @param  {Object} req
 * @param  {Object} res
 *
 * @author Jimmy (2013-08-02)
 */
Rest.prototype.retrieve = function(req, res) {
  // TODO: check permission


  // parse id: if you enter "13." it's working now
  var id = parseInt(req.params.id);

  // check invalid params id, -123, 1.23: category -1
  if (isNaN(req.params.id) ||
    id !== parseFloat(req.params.id)) {
    res.send(400, {
      error: {
        code: 104,
        message: "Invalid params id: " + req.params.id + "."
      }
    });
    return;
  }

  var schema = this._getSchema();

  var attrs = this._getAttrsFromQuery(req.query, schema);
  if (attrs.error) {
    res.send(attrs.httpStatus, attrs.error);
    return;
  }

  if (attrs.aggreates.length > 0 || attrs.relatives.length > 0) {
    // TODO: implement this method in the subclass
    this.retrieveAllAttrs(req, res, id, attrs);
  } else {
    var model = this._getModel();
    model.find({
      where: {id: id},
      attributes: attrs.fields
    }).success(function(data) {
      if (data) {
        res.send(data);
      } else {
        res.send(404, "Not Found.");
      }
    }).fail(function(err) {
      // TODO: log err and send warning email?
      logger.error('Rest.prototype.retrieve', err);
      res.send(500, "Internal Server Error.");
    });
  }
};

/**
 * Abstract method to retrieve all attrs
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Int} id
 * @param  {Object} attrs
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype.retrieveAllAttrs = function(req, res, id, attrs) {
  throw new Error('Rest.retrieveAllAttrs: Must implement this method "retrieveAllAttrs" in the subclass!');
};

/**
 * Method to update a model
 *
 * app.put('/<models>/:id', <models>.update);
 *
 * @param  {Object} req
 * @param  {Object} res
 *
 * @author Jimmy (2013-08-02)
 */
Rest.prototype.update = function(req, res) {
  // TODO: check permission


  // parse id: if you enter "13." it's working now
  var id = parseInt(req.params.id);

  // check invalid params id, -123, 1.23: category -1
  if (isNaN(req.params.id) ||
    id !== parseFloat(req.params.id)) {
    res.send(400, {
      error: {
        code: 104,
        message: "Invalid params id: " + req.params.id + "."
      }
    });
    return;
  }

  if (_.isEmpty(req.body)) {
    res.send(400, {
      error: {
        code: 103,
        message: "Empty data."
      }
    });
    return;
  }

  var schema = this._getSchema();

  var fields = _.keys(req.body);
  var invalidField = this._checkInvalidField(fields, schema);
  if (invalidField) {
    res.send(400, {
      error: {
        code: 101,
        message: "Invalid field: " + invalidField + "."
      }
    });
    return;
  }

  var model = this._getModel();
  model.find(id).success(function(data) {
    if (data) {
      var attrs = [];
      fields.forEach(function(key) {
        if (data[key] !== req.body[key]) {
          data[key] = req.body[key];
          attrs.push(key);
        }
      });
      if (attrs.length > 0) {
        data.save(attrs).success(function(data) {
          // TODO: 201 ???
          res.send(data);
        }).fail(function(err) {
          // TODO: log err and send warning email?
          logger.error('Rest.prototype.update', err);
          res.send(500, "Internal Server Error.");
        });
      } else {
        // nothing changed, return obj or a httpStatus?
        // res.send(200, "Nothing Changed.");
        res.send(data);
      }
    } else {
      res.send(404, "Not Found.");
    }
  }).fail(function(err) {
    // TODO: log err and send warning email?
    logger.error('Rest.prototype.update', err);
    res.send(500, "Internal Server Error.");
  });
};

/**
 * Method to delete a model
 *
 * app.del('/<models>/:id', <models>.destroy);
 *
 * @param  {Object} req
 * @param  {Object} res
 *
 * @author Jimmy (2013-08-02)
 */
Rest.prototype.destroy = function(req, res) {
  // TODO: check permission
  // TODO: 检查当前用户是否具有删除的权限


  // parse id: if you enter "13." it's working now
  var id = parseInt(req.params.id);

  // check invalid params id, -123, 1.23: category -1
  if (isNaN(req.params.id) ||
    id !== parseFloat(req.params.id)) {
    res.send(400, {
      error: {
        code: 104,
        message: "Invalid params id: " + req.params.id + "."
      }
    });
    return;
  }

  // TODO: 可能有些数据并不是真正的删除，需要根据具体情况做对应操作
  var model = this._getModel();
  model.find(id).success(function(data) {
    if (data) {
      // BUG: 如果是 pg 引擎，这里的 typeof data.id == string
      // DELETE FROM "review" WHERE "id" IN (SELECT "id" FROM "review" WHERE 11 LIMIT 1)
      // error: argument of WHERE must be type boolean, not type integer
      // if (typeof data.id !== 'number') data.id = parseInt(data.id);
      // version 2.0.0 no this error

      data.destroy().success(function(data) {
        // {
        //  "success": {
        //    "createdAt": "2012-06-15T16:59:11.276Z",
        //    "objectId": "YAfSAWwXbL"
        //  }
        // }
        res.send(data);
      });
    } else {
      res.send(404, "Not Found.");
    }
  });
};

/**
 * Method to search models
 *
 * app.get('/<models>?where=*&group=*&order=*&fields=id,name,*', <models>.search);
 *
 * @param  {Object} req
 * @param  {Object} res
 *
 * @author Jimmy (2013-08-02)
 */
Rest.prototype.search = function(req, res) {
  // TODO: check permission


  var pageNum = DEFAULT_PAGE_NUM;
  if (_.has(req.query, 'pageNum')) {
    pageNum = parseInt(req.query.pageNum);
    if (isNaN(req.query.pageNum) ||
      pageNum !== parseFloat(req.query.pageNum) ||
      pageNum < 0) {
      res.send(400, {
        error: {
          code: 104,
          message: "Invalid params pageNum: " + req.query.pageNum + "."
        }
      });
      return;
    }
  }

  var pageSize = DEFAULT_PAGE_SIZE;
  if (_.has(req.query, 'pageSize')) {
    pageSize = parseInt(req.query.pageSize);
    if (isNaN(req.query.pageSize) ||
      pageSize !== parseFloat(req.query.pageSize) ||
      pageSize < 0) {
      res.send(400, {
        error: {
          code: 104,
          message: "Invalid params pageSize: " + req.query.pageSize + "."
        }
      });
      return;
    }
  }

  var limit = pageSize;
  var offset = limit * (pageNum > 0 ? (pageNum - 1) : 0);
  var schema = this._getSchema();
  var attrs = this._getAttrsFromQuery(req.query, schema);
  if (attrs.error) {
    res.send(attrs.httpStatus, attrs.error);
    return;
  }

  var options = {
    attributes: attrs.fields,
    offset: offset,
    limit: limit
  };

  if (_.has(req.query, 'where')) {
    req.query.where = decodeURIComponent(req.query.where);

    if (this._isJson(req.query.where)) {
      // TODO: not sql injection safe here
      options.where = JSON.parse(req.query.where);
      // res.send(options.where);return;
    } else if (req.query.where.indexOf(':') > -1 && req.query.where.indexOf(',') > -1) {
      // ?where=id:1,3,5,7,9
      // where: { id: [1,3,5,7,9] }
      // 当前in 和 lt等不能同时工作
      var where = querystring.parse(req.query.where, ';', ':');
      var invalidField = this._checkInvalidField(_.keys(where), schema);
      if (invalidField) {
        res.send(400, {
          error: {
            code: 101,
            message: "Invalid field: " + invalidField + "."
          }
        });
        return;
      }
      _.map(where, function(item, index) {
        if (item.indexOf(',') > -1) {
          where[index] = item.split(',');
        }
      });
      options.where = where;
    } else if (req.query.where.indexOf(':') > -1) {
      // ?where=id:lt:13;id:gt:3
      // ?where=id:13;quantity:886;dscp:ShavingboardCabinet.;id:lt:15;id:gt:1
      // where: ["id > ? AND id < ?", '3', '13']
      var constraints = ['lte', 'lt', 'gte', 'gt', 'ne'];
      var where = req.query.where.split(';');
      var whereArr = [[]];
      var invalidFields = [];
      var invalidConstraints = [];
      var checkInvalidField = this._checkInvalidField;
      _.map(where, function(item, index){
        where[index] = item.split(':');
        var currentInvalidField = checkInvalidField([where[index][0]], schema);
        if (currentInvalidField) {
          invalidFields.push(currentInvalidField);
          return; // NOTICE: can't exit map
        } else {
          if (where[index].length == 3) {
            if (_.indexOf(constraints, where[index][1]) === -1) {
              invalidConstraints.push(where[index][1]);
              return; // NOTICE: can't exit map
            } else {
              where[index][1] = where[index][1].replace(/lte/g, '<=');
              where[index][1] = where[index][1].replace(/lt/g, '<');
              where[index][1] = where[index][1].replace(/gte/g, '>=');
              where[index][1] = where[index][1].replace(/gt/g, '>');
              where[index][1] = where[index][1].replace(/ne/g, '<>');
              // where[index][1] = where[index][1].replace(/in/g, 'IN');
              // where[index][1] = where[index][1].replace(/nin/g, 'NOT IN');
              whereArr[0].push(where[index][0] + ' ' + where[index][1] + ' ?');
              whereArr[index + 1] = where[index][2];
            }
          } else if (where[index].length == 2) {
            whereArr[0].push(where[index][0] + ' = ?');
            whereArr[index + 1] = where[index][1];
          }
        }
      });
      if (invalidFields.length > 0) {
        res.send(400, {
          error: {
            code: 101,
            message: "Invalid field: " + invalidFields.join(', ') + "."
          }
        });
        return;
      }
      if (invalidConstraints.length > 0) {
        res.send(400, {
          error: {
            code: 105,
            message: "Invalid query constraints: " + invalidConstraints.join(', ') + "."
          }
        });
        return;
      }
      whereArr[0] = whereArr[0].join(' AND ');

      options.where = whereArr;
    } else {
      res.send(400, {
        error: {
          code: 104,
          message: "Invalid params where: " + req.query.where + "."
        }
      });
      return;
    }
  }

  if (_.has(req.query, 'group')) {
    // group: ['name', 'type', 'team_id']
    options.group = req.query.group;
    options.group = req.query.group.split(',');
    var invalidField = this._checkInvalidField(options.group, schema);
    if (invalidField) {
      res.send(400, {
        error: {
          code: 101,
          message: "Invalid field: " + invalidField + "."
        }
      });
      return;
    }
  }

  if (_.has(req.query, 'order')) {
    // order: 'title DESC'
    options.order = req.query.order;
    options.order = req.query.order.split(',');
    var invalidFields = [];
    var checkInvalidField = this._checkInvalidField;
    _.map(options.order, function(item, index){
      var field = item.substring(0, 1) == '-' ? item.substr(1) : item;

      if (field == 'FIND_IN_SET' && _.has(options.where, 'id')) {
        // version 1.6.0
        // options.order[index] = 'FIND_IN_SET(id, \'' + options.where.id.join(',') + '\')';
        // version 2.0.0 NOTICE: 当有一个 order 带有 FIND_IN_SET 时不支持多个 order
        options.order = 'FIND_IN_SET(id, \'' + options.where.id.join(',') + '\')';
      } else {
        var currentInvalidField = checkInvalidField([field], schema);
        if (currentInvalidField) {
          invalidFields.push(currentInvalidField);
          return;
        }

        // NOTICE: - work in mysql?
        // version 1.6.0
        // options.order[index] = item.substring(0, 1) == '-' ? item.substr(1) + ' DESC' : item;
        options.order[index] = item.substring(0, 1) == '-' ? [item.substr(1), 'DESC'] : item;
      }
    });
    if (invalidFields.length > 0) {
      res.send(400, {
        error: {
          code: 101,
          message: "Invalid field: " + invalidFields.join(', ') + "."
        }
      });
      return;
    }
  }

  // res.send(options);return;

  if (attrs.aggreates.length > 0 || attrs.relatives.length > 0) {
    // TODO: implement this method in the subclass
    this.searchAllAttrs(req, res, options, attrs, pageNum, pageSize, limit);
  } else {
    var model = this._getModel();
    // NOTICE: why 'options.where' has been changed after findAll
    // if (_.has(options, 'where')) {
    //   var where = _.clone(options.where);
    // }
    // NOTICE: version 1.7 + ? use model.findAndCountAll({
    // model.findAll(options).success(function(data) {
    model.findAndCountAll(options).success(function(data) {
      var result = {
        'numRows'  : data.count,
        'pageNum'  : pageNum,
        'pageSize' : pageSize,
        'pageCount': Math.ceil(data.count / limit),
        'result'   : data.rows
      };
      res.send(result);

      /*
      var result = {
        'numRows'  : 0,
        'pageNum'  : pageNum,
        'pageSize' : pageSize,
        'pageCount': 0,
        'result'   : data
      };

      if (_.has(options, 'where')) {
        options.where = where;
      }

      if (data.length > 0) {
        // this's not correct
        delete options.attributes;
        delete options.offset;
        delete options.limit;
        delete options.group; // TODO: if delete group, count is not correct?
        delete options.order;
        // TODO: the count may be incorrect when run some complicated queries
        model.count(options).success(function(count) {
          result.numRows = count;
          result.pageCount = Math.ceil(count / limit);
          res.send(result);
        });
      } else {
        res.send(result);
      }
      */
    }).fail(function(err) {
      // res.send(err);
      // TODO: log err and send warning email?
      logger.error('Rest.prototype.search', err);
      res.send(500, "Internal Server Error.");
    });
  }
};

/**
 * Abstract method to search all attrs
 *
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Object} options
 * @param  {Object} attrs
 * @param  {Int} pageNum
 * @param  {Int} pageSize
 * @param  {Int} limit
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype.searchAllAttrs = function(req, res, options, attrs, pageNum, pageSize, limit) {
  throw new Error('Rest.searchAllAttrs: Must implement this method "searchAllAttrs" in the subclass!');
};

/**
 * Method to get sequelize model
 *
 * @return {Object}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._getModel = function() {
  if (this.model) {
    return this.model;
  } else {
    throw new Error('Rest._getModel: error: "this.model is undefined."');
  }
};

/**
 * Method to get model schema
 *
 * @return {Array}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._getSchema = function() {
  if (this.schema) {
    return this.schema;
  } else {
    throw new Error('Rest._getSchema: error: "this.schema is undefined."');
  }
};

/**
 * Method to get fields from query
 *
 * TODO: remove this method if never used
 *
 * @param  {Object} query
 * @param  {Object} schema
 *
 * @return {Array}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._getFieldsFromQuery = function(query, schema) {
  var result = schema.default;

  if (_.has(query, 'schema')) {
    if (!_.has(schema, query.schema)) {
      return {
        httpStatus: 400,
        error: {
          code: 100,
          message: "Invalid schema: " + query.schema + "."
        }
      };
    }
    result = schema[query.schema];
  }

  // ignore query.shcema if set query.fields
  if (_.has(query, 'fields')) {
    var fields = query.fields.split(',');
    if (fields.length > 0) {
      var invalidField = this._checkInvalidField(fields, schema);
      if (invalidField) {
        return {
          httpStatus: 400,
          error: {
            code: 101,
            message: "Invalid field: " + invalidField + "."
          }
        };
      }
      result = fields;
    }
  }

  return result;
};

/**
 * Method to get attributes from query
 *
 * @param  {Object} query
 * @param  {Object} schema
 *
 * @return {Object}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._getAttrsFromQuery = function(query, schema) {
  var result = {
    fields: schema.default,
    aggreates: [], //schema.aggreates || [],
    relatives: [] //schema.relatives || []
  };

  if (_.has(query, 'schema')) {
    if (!_.has(schema, query.schema)) {
      return {
        httpStatus: 400,
        error: {
          code: 100,
          message: "Invalid schema: " + query.schema + "."
        }
      };
    }
    result.fields = schema[query.schema];
  }

  // ignore query.shcema if set query.fields
  if (_.has(query, 'fields')) {
    var fields = query.fields.split(',');
    if (fields.length > 0) {
      var invalidFields = this._checkInvalidAttrs(fields, schema);
      if (invalidFields.length > 0) {
        return {
          httpStatus: 400,
          error: {
            code: 101,
            message: "Invalid fields: " + invalidFields.join(', ') + "."
          }
        };
      }
      result = this._getAttrsFromSchema(fields, schema);
    }
  }

  return result;
};

/**
 * Method to get attrs from schema
 *
 * 遍历fields，将对应schema的fields放入对应的数组中
 *
 * @param  {Array} fields
 * @param  {Object} schema
 *
 * @return {Object}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._getAttrsFromSchema = function(fields, schema) {
  var result = {
    fields: [],
    aggreates: [],
    relatives: []
  };

  fields.forEach(function(field) {
    if (_.indexOf(schema.all, field) !== -1) {
      result.fields.push(field);
    }
    if (_.indexOf(schema.aggreates, field) !== -1) {
      result.aggreates.push(field);
    }
    if (_.indexOf(schema.relatives, field) !== -1) {
      result.relatives.push(field);
    }
  });

  if (result.fields.length === 0 && result.aggreates.length && result.relatives.length) {
    result.fields = schema.default;
  } else if (result.fields.length === 0) {
    result.fields = ['id']; // TODO: schema.default;
  } else if (_.indexOf(result.fields, 'id') === -1) {
    result.fields.push('id'); // TODO: return some strange results if without id
  }

  return result;
};

/**
 * Method to check invalid field
 *
 * @param  {Array} fields
 * @param  {Object} schema
 *
 * @return {Boolean|String}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._checkInvalidField = function(fields, schema) {
  var result = false;
  fields.forEach(function(field) {
    if (_.indexOf(schema.all, field) == -1) {
      result = field;
      return; // NOTICE: exit forEach, not exit func
    }
  });
  return result;
};

/**
 * Method to get invalid attrs
 *
 * @param  {Array} attrs
 * @param  {Object} schema
 *
 * @return {Array}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._checkInvalidAttrs = function(attrs, schema) {
  var schemaAttrs = _.union(schema.all, schema.aggreates || [], schema.relatives || []);
  return _.difference(attrs, schemaAttrs);
};

/**
 * Method to check if string is JSON
 *
 * @param  {String} str
 *
 * @return {Boolean}
 *
 * @author Jimmy (2013-08-07)
 */
Rest.prototype._isJson = function(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
