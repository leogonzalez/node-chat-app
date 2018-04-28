const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const { generateMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {

  //log at the server to let know new connection
  console.log("New connection");

  // log to the new user, from server, the welcome message
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the chat app")
  );

  //let all the clients know new connection
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );

  //log on server that someone Disconnected
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });

  // listening for msg events from Client
  socket.on("createMessage", (msg, callback) => {
    console.log("New message from Client", msg);
    socket.broadcast.emit("newMessage", generateMessage(msg.from, msg.text));
    callback('This is from the server');
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
