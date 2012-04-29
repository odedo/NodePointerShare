$(function () {
  // this is the simplest way to get a client side token. it will be used to identify an active instance.
  // in the "real world", you might want to generate a globally unique id using a server-side call
  var clientId = Math.uuid();

  // create the shared pointer surface
  var sharedSurface = new surface($("#surface"));
      
  // init the mouse movment tracker and attach it to the surface
  var mouseMovmentThreashold = 15; // the mouse pointer will have to be moved at least X pixels in each direction before we invoke the server-side call
	var tracker = new pointerTracker(clientId, mouseMovmentThreashold);
  sharedSurface.attachTracker(tracker);
      
  // connect to remote socket server for live updates
  var socket = io.connect('http://localhost:81');
      
  // listen to incoming events from the server
  socket.on('updatePointer', function (data) {
    if (clientId != data.clientId) {
      sharedSurface.updatePointer(data.clientId, data.x, data.y);
    }
  });
  socket.on('clearPointer', function (data) {
    if (clientId != data.clientId) {
      sharedSurface.clearPointer(data.clientId);
    }
  });

  // submit pointer changes to the server
  tracker.updatePointer(function (x, y) {
    socket.emit('updatePointer', { x: x, y: y, clientId: clientId });
  });
  tracker.clearPointer(function () {
    socket.emit('clearPointer', { clientId: clientId });
  });
});