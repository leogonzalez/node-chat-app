var socket = io();
socket.on("connect", function() {
  console.log("Connected to server");
});

socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// new email from server - listening

socket.on('newMessage', function (msg) {
  console.log('New message', msg);
});
