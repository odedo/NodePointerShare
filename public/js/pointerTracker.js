function pointerTracker(clientId, threashold) {

  // store the last submitted values
  var lastSubmittedX = 0;
  var lastSubmittedY = 0;
  
  // store the callback functions
  var updatePointerCallback;
  var clearPointerCallback;

  // track a mouse movment
  this.track = function (x, y) {
    var submit = false;
    if (Math.abs(x - lastSubmittedX) > threashold) {
      submit = true;
    } else if (Math.abs(y - lastSubmittedY) > threashold) {
      submit = true;
    }

    // check if we need to submit the position of the cursor to the server
    if (submit) {
      if (updatePointerCallback) {
        updatePointerCallback(x, y);
      }
      lastSubmittedX = x;
      lastSubmittedY = y;
    }
  }

  // reset the tracker - maily because the user's cursor is out of the bounds of the tracked surface
  this.reset = function () {
    lastSubmittedX = lastSubmittedY = 0;
    if (clearPointerCallback) {
      clearPointerCallback();
    }
  }
  
  // set the update pointer callback function
  this.updatePointer = function(callback) {
    updatePointerCallback = callback;
  }
  
  // set the clear pointer callback function
  this.clearPointer = function(callback) {
    clearPointerCallback = callback;
  }
}