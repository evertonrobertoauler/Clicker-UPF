'use strict';

(function() {

  var queries = require('./queries');
  var User = require('mongoose').model('User');
  var _ = require('lodash');

  var defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
    return _.merge(value, other, deep);
  });

  exports.list = function(req, res) {

    var filter = queries.filter(req.query);
    filter.select = 'displayName';
    filter.where = defaultsDeep(req.query.where || {}, {_id: {$ne: req.user._id}});

    queries.findList(User, filter)
      .then(function(data) {
        res.jsonp({length: data[0], list: data[1]});
      })
      .fail(function(err) {
        console.trace(err);
        res.status(400).jsonp(err);
      });
  };
})();