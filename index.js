'use strict';
const PORT = 4222;

const fs = require('fs');
const debug = require('debug')('warp:conductor');

//Server settings
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));

http.listen(PORT, function(){
  debug('Listen on ',PORT);
});

//Johnny-Five

const BoardManager = require('./server/BoardManager.js');
const board = new BoardManager(io);

//--HACK: This is fucking code. need refactoring ASAP!!!
io.sockets.on('connection', (socket) => {
  debug('client connected');
  socket.on('ledStatus', (status) => {
    board.changeLedStatus(status);
  });
  socket.on('servo', (data) => {
    if (data.servo == 'servo_yaw') {
      board.servoMove('yaw', data.vol);
    } else if (data.servo == 'servo_right') {
      board.servoMove('right', data.vol);
    } else if (data.servo == 'servo_left') {
      board.servoMove('left', data.vol);
    }
  });
  socket.on('speech', (command) => {
    if (command == 'name') {
      board.servoAction(90, 10, 50, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(90, 90, 90, 1000))
      .then(board.servoAction(10, 80, 100, 1000));
    } else if (command == 'morning') {
      debug('command morning');
      board.servoAction(80, 70, 50, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(100, 100, 100, 1000))
      .then(board.servoAction(90, 90, 70, 1000))
      .then(board.servoAction(120, 70, 80, 1000));
    }
    else if (command == 'what') {
      debug('command what');
      board.servoAction(80, 70, 50, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(60, 90, 90, 1000))
      .then(board.servoAction(80, 70, 50, 1000))
      .then(board.servoAction(120, 70, 80, 1000));
    } else if (command == 'who') {
      debug('command what');
      board.servoAction(90, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(100, 100, 100, 1000))
      .then(board.servoAction(90, 90, 70, 1000))
      .then(board.servoAction(90, 70, 80, 1000));
    } else if (command == 'how-much') {
      debug('command how-much');
      board.servoAction(90, 10, 50, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(100, 100, 100, 1000))
      .then(board.servoAction(90, 90, 70, 1000));
    } else if (command == 'business') {
      debug('command business');
      board.servoAction(90, 10, 50, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(20, 90, 90, 1000))
      .then(board.servoAction(120, 70, 50, 1000))
      .then(board.servoAction(90, 70, 80, 1000));
    } else if (command == 'rich') {
      debug('command rich');
      board.servoAction(90, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(10, 90, 90, 1000))
      .then(board.servoAction(150, 90, 90, 1000))
      .then(board.servoAction(90, 90, 90, 1000));
    } else if (command == 'danbo') {
      debug('command danbo');
      board.servoAction(30, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(20, 90, 90, 1000))
      .then(board.servoAction(120, 70, 50, 1000))
      .then(board.servoAction(90, 70, 80, 1000));
    } else if (command == 'touch') {
      debug('command touch');
      board.servoAction(30, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(60, 90, 90, 1000))
      .then(board.servoAction(80, 70, 50, 1000))
      .then(board.servoAction(90, 70, 80, 1000));
    } else if (command == 'weather') {
      debug('command weather');
      board.servoAction(10, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(10, 90, 90, 1000))
      .then(board.servoAction(150, 90, 90, 1000))
      .then(board.servoAction(10, 90, 80, 1000));
    } else if (command == 'amazing') {
      debug('command amazing');
      board.servoAction(30, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(10, 90, 90, 1000))
      .then(board.servoAction(150, 90, 90, 1000))
      .then(board.wait(3000))
      .then(board.servoAction(90, 70, 80, 1000));
    }  else if (command == 'document') {
      debug('command document');
      board.servoAction(30, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(60, 90, 90, 1000))
      .then(board.servoAction(80, 70, 50, 1000))
      .then(board.wait(3000))
      .then(board.servoAction(90, 70, 80, 1000));
    } else if (command == 'noperson') {
      debug('command noperson');
      board.servoAction(10, 90, 90, 1000)()
      .then(board.wait(1000))
      .then(board.servoAction(20, 90, 90, 1000))
      .then(board.servoAction(120, 70, 50, 1000))
      .then(board.servoAction(10, 90, 80, 1000));
    }
  });
});
