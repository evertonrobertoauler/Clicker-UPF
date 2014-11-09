'use strict';

angular
  .module('openpiApp')
  .factory('Socket', function(SOCKET_URL) {
    return io.connect(SOCKET_URL);
  });