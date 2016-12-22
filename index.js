'use strict';
const PORT = 4222;
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
const board = new BoardManager();

board.on('ledStatusChanged', (status) => {
  debug('ledStatusChanged Event', status);
  io.sockets.emit('ledStatus', this.ledStatus);
});

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

  socket.on('speech', (title) => {
    debug(`receive speech action request "${title}"`);
    board.play(title)
    .then(() => {
      debug('speech action completed');
    })
    .catch((err) => {
      debug(`speech action failed ${err}`);
    });
  });
});
