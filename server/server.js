const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const PORT = process.env.PORT || 3000;
const { generateMessage, generateLocationMessage } = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
const app = new express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  //log at the server to let know new connection
  console.log("New connection");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Params required");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app")
    );

    //let all the clients know new connection
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} has joined`)
      );
    callback();
  });

  //log on server that someone Disconnected
  socket.on("disconnect", () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', {
        from: 'Admin',
        text: `${user.name} has left the room`
      })
    }
  });

  // listening for msg events from Client
  socket.on("createMessage", (msg, callback) => {
    console.log("New message from Client", msg);
    io.emit("newMessage", generateMessage(msg.from, msg.text));
    callback("This is from the server");
  });

  socket.on("createLocationMessage", coords => {
    console.log("New location message from Client", coords);
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
