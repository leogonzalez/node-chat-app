var socket = io();

function scrollToBottom() {
  //selectors
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  var lastMessageHeight = newMessage.prev().innerHeight();
  //height
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// new email from server - listening

socket.on("newMessage", function(msg) {
  var formattedTime = moment(msg.createdAt).format("h:mm a");
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  scrollToBottom();
});

socket.on("newLocationMessage", function(msg) {
  var formattedTime = moment(msg.createdAt).format("h:mm a");
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    text: msg.text,
    from: msg.from,
    url: msg.url,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  scrollToBottom();
});

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();
  var msgTextBox = jQuery(`[name=message]`);
  socket.emit(
    "createMessage",
    {
      from: "User",
      text: msgTextBox.val()
    },
    function() {
      msgTextBox.val("");
    }
  );
});

var locationButton = jQuery("#send-location");

locationButton.on("click", function(e) {
  if (!navigator.geolocation) {
    return alert("geolocation not supported by your browser");
  }

  locationButton.attr("disabled", "disabled").text("sending location...");
  navigator.geolocation.getCurrentPosition(
    function(position) {
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      locationButton.removeAttr("disabled").text("Send location");
    },
    function(error) {
      console.log("Error", error);
      locationButton.removeAttr("disabled").text("Send location");
    }
  );
});
