'use strict';

(function() {

  var queries = require('./queries');
  var User = require('mongoose').model('User');
  var _ = require('lodash');
  var Q = require('q');

  var defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
  });

  exports.list = Q.async(function*(req, res) {
    try {
      var filter = queries.filter(req.query);
      filter.select = 'displayName';
      filter.where = defaultsDeep(req.query.where || {}, {_id: {$ne: req.user._id}});

      var data = yield queries.findList(User, filter);
      res.jsonp({length: data[0], list: data[1]});
    } catch (e) {
      console.trace(e);
      res.status(400).jsonp(e);
    }
  });
})();