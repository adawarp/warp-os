"use strict";
const PORT = 4222;

//iRobot create2 modules
const SerialPort = require('serialport');
const fs = require('fs');
const debug = require('debug')('create2:driver');
const Repl = require('repl');

//Server settings
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));

http.listen(PORT, function(){
  console.log('Listen on ',PORT);
});

//Johnny-Five
const five = require('johnny-five');
const board = new five.Board({'repl':false});
const BoardManager = require('./server/BoardManager.js');
const boardManager = new BoardManager(io);

let led = null;
let servo_yaw = 90;
let servo_right = 90;
let servo_left = 90;

board.on('ready', function() {
  console.log('hello board');
  led = new five.Led(13);
  servo_yaw = new five.Servo({
    id : 'yaw',
    pin : 3,
    range: [30, 150],
    startAt: 90
  });
  servo_right = new five.Servo({
    id : 'right',
    pin : 6,
    range: [30, 150],
    startAt: 90
  });
  servo_left = new five.Servo({
    id : 'left',
    pin : 9,
    range: [30, 150],
    startAt: 90
  });
});

io.sockets.on('connection', function(socket) {
  console.log('hello socket');
	socket.on('ledStatus', function(status) {
    boardManager.ledStatus(led, status);
	});
  socket.on('servo', function(data) {
    if (data.servo == 'servo_yaw') {
      boardManager.servoMove(servo_yaw, data.vol);
    } else if (data.servo == 'servo_right') {
      boardManager.servoMove(servo_right, data.vol);
    } else if (data.servo == 'servo_left') {
      boardManager.servoMove(servo_left, data.vol);
    }
  });
  socket.on('speech', function(data) {
    console.log(data);
  })
});
