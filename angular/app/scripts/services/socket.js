'use strict';

angular
  .module('openpiApp')
  .factory('Socket', function(SOCKET_URL) {
    var socket;

    return {
      connect: function(token) {
        socket = io.connect(SOCKET_URL, {query: 'token=' + token});
        socket.on('this', function (data) {
          console.log(data);
          socket.emit('private message', { my: 'data' });
        });
        return socket;
      },
      disconnect: function() {
        if (socket && socket.disconnect) {
          socket.disconnect();
        }
      }
    };
  });