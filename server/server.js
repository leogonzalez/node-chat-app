const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname, "../public");
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New connection");

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });

  // listening for email events from Client
  socket.on("createMessage", msg => {
    console.log("New message from Client", msg);
    io.emit("newMessage", {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    })
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
