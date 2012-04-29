(function() {

  var redis = require("redis");
  var clientsSetKey = 'clients';
  
  // Create client and authenticate
  client = redis.createClient(9880, "herring.redistogo.com");
  client.auth('80871e12f40c2c1189c665302345d23c');
  
  // Clear the cache from any "stale" values.
  client.del(clientsSetKey);
  
  // Redis error listener
  client.on('error', function (e) {
    console.log(e);
  });
  
  // Update a pointer's location
  module.exports.updatePointer = function(clientId, x, y) {
    console.log('New pointer position for ClientId=' + clientId + "(" + x + "," + y + ")");
    var point = x + "," + y; // we should probably serialize these values into a proper json in the future
    client.hset(clientsSetKey, clientId, point);
  }

  // Remove a pointer's value from the cache
  module.exports.clearPointer = function(clientId) {
    console.log('Clear pointer for ClientId=' + clientId);
    client.hdel(clientsSetKey, clientId);
    module.exports.getAllPointers();
  }
  
  // Get all the client's pointers
  module.exports.getAllPointers = function(callback) {
    // get all the client ids
    client.hkeys(clientsSetKey, function (err, replies) {

      // for every client id, load it's pointer coordinates
      replies.forEach(function (clientId, i) {
        client.hget(clientsSetKey, clientId, function(err, res) {
          
          // no error - "deserialize" the values and invoke the callback
          if (!err) {
            var point = res.split(',');
            var x = parseInt(point[0]);
            var y = parseInt(point[1]);
          
            // make sure that a callback was provided
            if (callback) {
              callback(clientId, x, y);
            }
          }
        });
      });
    });
  }
    
}());