var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// new email from server - listening

socket.on("newMessage", function(msg) {
  console.log("New message", msg);
  var li = jQuery('<li></li>')
  li.text(`${msg.from}: ${msg.text}`)
  jQuery("#messages").append(li)
});

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault()
  console.log(e);
  socket.emit(
    "createMessage",
    {
      from: 'User',
      text: jQuery("[name=message]").val()
    },
    function(data) {
      console.log("Got it", data);
    }
  );
});
