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
    range: [30, 150],
    startAt: 90
  });
});

io.sockets.on('connection', function(socket) {
  console.log("hello socket");
  socket.on('servo', function(deg) {
    //console.log(deg.left.vertical);
    //console.log(deg[0]);
    if (deg !== null && deg !== undefined) servo_yaw.to(deg);
  })
});