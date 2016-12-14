"use strict";
const PORT = 4222;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const server = require("./server");
app.use(express.static(__dirname + '/client'));

server.start(app, http, PORT);

//johnny-five
let five = require('johnny-five');
let board = new five.Board({"repl":false});
//let board = new five.Board({ port: "/dev/tty.usbmodem1411" }, {"repl":false});

let servo_yaw = 90;
let servo_pitch = 90;


board.on("ready", function() {
  console.log("hello board");
  servo_yaw = new five.Servo({
    pin : 3,
    range: [30, 150],
    startAt: 90
  });

  servo_pitch = new five.Servo({
    pin : 5,
    range: [70, 110],
    startAt: 90
  });
});

io.sockets.on('connection', function(socket) {
  console.log("hello socket");
  socket.on('servo', function(deg) {
    //console.log(deg);
    if (deg[0] !== null && deg[0] !== undefined && 10 < deg[0] && deg[0] < 170) servo_yaw.to(180 - deg[0]);
    if (deg[1] !== null && deg[1] !== undefined && 10 < deg[1] && deg[1] < 170) servo_pitch.to(180 - deg[1]);
  })
});