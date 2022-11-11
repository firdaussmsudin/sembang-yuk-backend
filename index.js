const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const {
  getUsers,
  addUsers,
  removeUsers,
  getUsersByRoom,
} = require("./users.js");

const { Server } = require("socket.io");

const router = require('./router');

const PORT = process.env.PORT || 3001

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://firdaussmsudin.github.io/",
    methods: ["GET", "POST"],
  },
});

app.use(router);

io.on("connection", (socket) => {
  socket.on("login",({username, room}, callback) => { 
    const currentUser = getUsersByRoom(room);
    const usernameExisted = currentUser.find(
      (user) => user.username == username
    )
    ? true
    : false;
    // console.log(currentUser);
    // console.log("usernameExisted: ", usernameExisted);
   return callback({userStatus:usernameExisted});
   })

  socket.on("join_room", ({ username, room }) => {
    socket.join(room);
    addUsers(socket.id, username, room);

    socket.emit("message", {
      text: `Hi ${username}. Welcome to room ${room}`,
      username: "admin",
      time: null,
    });

    socket.to(room).emit("message", {
      text: `${username} has joined the room`,
      username: "admin",
      time: null,
    });

    io.in(room).emit("online", getUsersByRoom(room));
  });

  socket.on("send_message", (data, room) => {
    console.log(data);
    socket.to(room).emit("message", data);
  });

  socket.on("log_out", ({ username, room }) => {
    socket.to(room).emit("message", {
      text: `${username} has left the room`,
      username: "admin",
      time: null,
    });
    removeUsers(socket.id);
    socket.to(room).emit("online", getUsersByRoom(room));
  });

  socket.on("disconnect", () => {
    console.log("disconnect", getUsers());
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
