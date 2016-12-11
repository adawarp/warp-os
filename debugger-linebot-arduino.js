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
let led, servo_yaw, servo_pitch;

board.on("ready", function() {
  console.log("hello board");
  led = new five.Led(13);
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
  socket.on('command', function(command) {
    console.log('Command : ' + command);
    //socket.broadcast.emit('ledStatus', status);
    if(command == "up") {
      servo_pitch.to(110);
    } else if (command == "down") {
      servo_pitch.to(60);
    } else if (command == "left") {
      servo_yaw.to(140);
    } else if (command == "right") {
      servo_yaw.to(40);
    } else if (command == "reset") {
      servo_yaw.to(90);
      servo_pitch.to(90);
    }
  });
});