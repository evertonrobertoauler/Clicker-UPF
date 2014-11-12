'use strict';

(function() {
  var mongoose = require('mongoose');
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

  var getCount = function(Model, filter) {
    return exec(Model.count(filter.where));
  };

  var getList = function(Model, filter) {
    return exec(
      Model
        .find(filter.where)
        .sort(filter.sort)
        .skip(filter.offset)
        .limit(filter.limit)
    );
  };

  exports.findList = function(model, filter) {
    var Model = mongoose.model(model);

    return Q.all([
      getCount(Model, filter),
      getList(Model, filter),
    ]);
  };

})();