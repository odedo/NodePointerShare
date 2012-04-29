function surface(element) {

  var tracker;
  
  // track mouse movement on the surface
  element.mousemove(function (e) {
    if (tracker) {
      // get the location of the surface, relative to the page
      var x = element.offset().left;
      var y = element.offset().top;
      tracker.track(e.clientX - x, e.clientY - y);
    }
  });

  // track the event where the mouse leaves our surface
  element.mouseleave(function (e) {
    if (tracker) {
      tracker.reset();
    }
  });

  // attach a mouse tracker object
  this.attachTracker = function(t) {
    tracker = t;
  }
	
  // draw a pointer on the surface
  this.updatePointer = function(clientId, x, y) {
		var pointer = $('#' + getPointerElementId(clientId));
    if (pointer.length == 0) {
      // no such element, so we'll create it
      pointer = $('<img src="/public/images/pointer.png" />');
      pointer.attr('id', getPointerElementId(clientId));
      pointer.css('position', 'absolute');
      $('body').append(pointer);
    }
    
    // get the position of the element in the client's window
    var left = element.offset().left;
    var top = element.offset().top;
    
    // position the pointer
    pointer.css('left', left + x);
    pointer.css('top', top + y);
  }
	
  // remove pointer 
  this.clearPointer = function(clientId) {
		var pointer = $('#' + getPointerElementId(clientId));
    if (pointer) {
      pointer.remove();
    }
  }
	
  // get the id of the pointer dom element
  function getPointerElementId(clientId) {
    return "pointer_" + clientId;
  }
}