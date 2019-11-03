// import { truncate } from "fs";

//Make connection
var socket = io.connect("https://insidious-saxophone.glitch.me");

//Query DOM
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var previousCursor;

//Event Listeners

btn.addEventListener("click", function() {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
    realtime: false
  });
});

$("#message").each(function() {
  var elem = $(this);

  // Save current value of element
  elem.data("oldVal", elem.val());

  // Look for changes in the value
  elem.bind("propertychange change click keyup input paste", function(event) {
    // If value has changed...
    if (elem.data("oldVal") != elem.val()) {
      // Updated stored value
      elem.data("oldVal", elem.val());
      // Do action
      previousCursor = message.selectionStart;
      socket.emit("chat", {
        message: message.value,
        handle: handle.value,
        realtime: true,
        caretPos: message.selectionStart
      });
    }
  });
});

//Listen for incoming messages(events)
socket.on("chat", function(data) {
  if (data.realtime) {
    let p = document.getElementById("realtime");
    p.innerHTML = data.message;
    message.value = data.message;
    if(previousCursor > data.caretPos){
      previousCursor++;
    }
    message.setSelectionRange(previousCursor, previousCursor);
    
    console.log(data.caretPos);
  } else {
    output.innerHTML +=
      "<p><b>" + data.handle + ":</b> " + data.message + "</p";
  }
});
