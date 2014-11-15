'use strict';

(function() {
  var Q = require('q');

  exports.filter = function(data) {
    var limit = Math.min(10, data.limit || 10);

    return {
      limit: limit,
      offset: ((data.offset || 1) - 1) * limit,
      sort: data.sort || {_id: -1},
    };
  };

  var exec = exports.exec = function(query, method) {

    method = method || 'exec';

    return Q.Promise(function(resolve, reject) {
      query[method](function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  exports.execList = function(queries, method) {
    return Q.all(queries.map(function(q){
      exec(q, method);
    }));
  };

  var getCount = function(Model, filter) {
    return exec(Model.count(filter.where));
  };

  var getList = function(Model, filter) {
    return exec(
      Model
        .find(filter.where)
        .select(filter.select)
        .sort(filter.sort)
        .skip(filter.offset)
        .limit(filter.limit)
    );
  };

  exports.findList = function(Model, filter) {
    return Q.all([
      getCount(Model, filter),
      getList(Model, filter),
    ]);
  };

})();