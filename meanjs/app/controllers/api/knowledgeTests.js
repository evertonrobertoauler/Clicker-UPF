'use strict';

(function() {

  exports.list = function(req, res) {
    console.log(req.query);
    res.jsonp({length: 0, list: []});
  };

})();
