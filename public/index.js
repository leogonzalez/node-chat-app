var socket = io();

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// new email from server - listening

socket.on("newMessage", function(msg) {
  var li = jQuery("<li></li>");
  li.text(`${msg.from}: ${msg.text}`);
  jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(msg) {
  var li = jQuery("<li></li>");
  var a = jQuery('<a target="_blank">Current Loca</a>');
  li.text(`${msg.from}: `);
  a.attr("href", msg.url);
  li.append(a);
  jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();
  var msgTextBox = jQuery(`[name=message]`)
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: msgTextBox.val()
    },
    function() {
      msgTextBox.val('')
    }
  );
});

var locationButton = jQuery("#send-location");

locationButton.on("click", function(e) {
  if (!navigator.geolocation) {
    return alert("geolocation not supported by your browser");
  }

  locationButton.attr('disabled', 'disabled').text('sending location...');
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.removeAttr('disabled').text('Send location');
    },
    function(error) {
      console.log("Error", error);
      locationButton.removeAttr('disabled').text('Send location');
    }
  );
});
