(function() {
  
  var io;
  var cache = require('./cache');

  // init the i/o communication mocule
  module.exports.init = function(app) {
    io = require('socket.io').listen(app);
    
    io.sockets.on('connection', function (socket) {
      // when client is connected, we want to send it all the cached pointer locations
      cache.getAllPointers(function(clientId, x, y) {
        console.log('sending data to client - ' + clientId)
        socket.emit('updatePointer', { x: x, y: y, clientId: clientId });
      });
      
      // a client send his updated mouse coordinates
      socket.on('updatePointer', function(data) {
        cache.updatePointer(data.clientId, data.x, data.y);
        // broadcast the event to all listeners
        socket.broadcast.emit('updatePointer', data);
      });

      // a client clears his mouse coordinates
      socket.on('clearPointer', function(data) {
        cache.clearPointer(data.clientId);
        // broadcast the event to all listeners
        socket.broadcast.emit('clearPointer', data);
      });
    });
  };

}());