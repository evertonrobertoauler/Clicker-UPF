'use strict';

angular
  .module('openpiApp')
  .factory('Socket', function(SOCKET_URL) {
    var socket;

    return {
      connect: function(token) {
        socket = io.connect(SOCKET_URL, {query: 'token=' + token});
        return socket;
      },
      disconnect: function() {
        if (socket && socket.connected) {
          socket.disconnect();
        }
      },
      on: function(event, fn) {
        if (socket) {
          socket.on(event, fn);
        }
      },
      off: function(event, fn) {
        if (socket) {
          socket.off(event, fn);
        }
      },
    };
  });