'use strict';
const PORT = 4222;
const debug = require('debug')('warp:conductor');

//Server settings
const express = require('express');
//Johnny-Five

const BoardManager = require('./BoardManager.js');

class Server {
  constructor() {
    this.board = new BoardManager();
    this.board.on('ledStatusChanged', (status) => {
      debug('ledStatusChanged Event', status);
      this.io.sockets.emit('ledStatus', this.ledStatus);
    });

    this.app = express();
    this.app.use(express.static(__dirname + '/../client'));
    this.http = require('http').Server(this.app);
    this.io = require('socket.io')(this.http);
  }

  start() {
    this.http.listen(PORT, function(){
      debug('Listen on ',PORT);
    });
    this.io.sockets.on('connection', (socket) => {
      debug('client connected');

      socket.on('command', (command) => {
        debug(command);
        switch(command.type) {
          case 'LED':
            this.board.changeLedStatus(command.status);
            break;
          case 'servo':
            this.board.servoMove(command.servo, command.angle);
            break;
          default:
            debug("Invalid commnad received ", command);
        }
      });

      socket.on('ledStatus', (status) => {
        this.board.changeLedStatus(status);
      });

      socket.on('servo', (data) => {
        if (data.servo == 'servo_yaw') {
          this.board.servoMove('yaw', data.vol);
        } else if (data.servo == 'servo_right') {
          this.board.servoMove('right', data.vol);
        } else if (data.servo == 'servo_left') {
          this.board.servoMove('left', data.vol);
        }
      });

      socket.on('speech', (title) => {
        debug(`receive speech action request "${title}"`);
        this.board.play(title)
        .then(() => {
          debug('speech action completed');
        })
       .catch((err) => {
         debug(`speech action failed ${err}`);
       });
      });
    });
  }
}

if(process.argv0 === 'node' || process.argv0 === 'node-dev') {
  let server = new Server();  
  server.start();
}
module.exports = Server;
