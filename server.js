const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const OldChats = require("./models/model");
require("dotenv").config();

mongoose.connect(process.env.DATA_BASE);

let user = {};
let old = [];

const getOldCharts = async () => {
  const charts = await OldChats.find({});
  return charts;
};

const oldArray = getOldCharts().then((results) => {
  old = results;
});

const setOldChart = async (chart) => {
  const addChart = new OldChats(chart);
  const save = await addChart.save();
};

const io = socketIo(server);

// All users are stored here
const Users = [];

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("joinroom", (room) => {
    socket.join(room.room);
  });

  // Current user is stored here

  socket.on("sendMessage", (msg) => {
    const { message, room } = msg;

    const chart = {
      message,
      room,
      userName: user.name,
      userEmail: user.email,
    };

    setOldChart(chart);

    io.to(user.room).emit("message", chart);
  });

  socket.on("getOldmessages", (msg) => {
    const oldEl = old.filter((item) => item.room === user.room);
    io.to(user.room).emit("oldmessages", { old: oldEl });
  });

  socket.on("userDetails", (data) => {
    const { password, email, name, room } = data;
    Users.push({ email, name, room: room.name });
    user = { email, name, room: room.name };
  });
});

app.use(cors());
server.listen(4000, () => console.log("listening"));
