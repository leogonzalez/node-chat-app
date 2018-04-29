const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const { generateMessage, generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const { isRealString} = require('./utils/validation')
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {

  //log at the server to let know new connection
  console.log("New connection");

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Params required')
    }

    socket.join(params.room);
    //socket.leave(params.room)

    // io.emit - emit to everybody || io.to(params.room).emit() - send to everyone in the room
    // socket.broadcast.emit - everyone except the current user || socket.broadcast.to everyone on the room
    // socket.emit - emit to one user
    // log to the new user, from server, the welcome message
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    //let all the clients know new connection
    socket.broadcast.to(params.room).emit(
      "newMessage",
      generateMessage("Admin", `${params.name} has joined`)
    );
    callback()
  })

  //log on server that someone Disconnected
  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });

  // listening for msg events from Client
  socket.on("createMessage", (msg, callback) => {
    console.log("New message from Client", msg);
    io.emit("newMessage", generateMessage(msg.from, msg.text));
    callback('This is from the server');
  });

  socket.on("createLocationMessage", (coords) => {
    console.log("New location message from Client", coords);
    io.emit("newLocationMessage", generateLocationMessage('Admin', coords.latitude,coords.longitude));
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
