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
//let five = require('johnny-five');
//let board = new five.Board({"repl":false});
//let board = new five.Board({ port: "/dev/tty.usbmodem1411" }, {"repl":false});


/*board.on("ready", function() {
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
});*/

io.sockets.on('connection', function(socket) {
  console.log("hello socket");
  socket.on('ledStatus', function(status) {
    console.log('Led status is : ' + status);
    //socket.broadcast.emit('ledStatus', status);
  });
});