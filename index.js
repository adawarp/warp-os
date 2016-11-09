"use strict";
const PORT = 4222;

//to control iRobot create2
const SerialPort = require("serialport");
const fs = require("fs");
const debug = require("debug")("create2:driver");
const Repl = require("repl");

//http server
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
let led = null;

board.on("ready", function() {
  console.log("hello board");
  led = new five.Led(13);
  led.off();
  servo_yaw = new five.Servo({
    pin : 3,
    range: [30, 150],
    startAt: 90
  });
});

io.sockets.on('connection', function(socket) {
  console.log("hello socket");
	socket.on('ledStatus', function(status) {
		if (status) {
			console.log("Led on!!!");
			led.on();
		} else {
			console.log("Led off...");
			led.stop().off();
		}
	});
	socket.on('servo', function(deg) {
		//console.log(deg.left.vertical);
    //console.log(deg[0]);
		if (deg[0] !== null && deg[0] !== undefined) servo_yaw.to(180 - deg[0]);
	})
});

const roombaController = require("./roombaController.js");
roombaController.start(io, fs, debug);
