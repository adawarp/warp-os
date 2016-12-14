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
let five = require('johnny-five');
let board = new five.Board({'repl':false});

let servo_yaw = 90;
let led = null;
const BoardManager = require('./server/BoardManager.js');
const boardManager = new BoardManager(io);

board.on('ready', function() {
  console.log('hello board');
  led = new five.Led(13);
  led.off();
  servo_yaw = new five.Servo({
    pin : 3,
    range: [30, 150],
    startAt: 90
  });
});

io.sockets.on('connection', function(socket) {
  console.log('hello socket');
	socket.on('ledStatus', function(status) {
    console.log(status)
    boardManager.ledStatus(led, status);
	});
	/*socket.on('servo', function(deg) {
		//console.log(deg.left.vertical);
    //console.log(deg[0]);
		if (deg[0] !== null && deg[0] !== undefined) servo_yaw.to(180 - deg[0]);
	})*/
});
