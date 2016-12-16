'use strict';
const five = require('johnny-five');
const board = new five.Board({'repl':false});
const debug = require('debug')('warp:board');

class BoardManager {

  constructor(io) {
    this.io = io;
    this.servos = {};
    this.led = null;
    this.isActive = false;
    board.on('ready', function() {
      this.led = new five.Led(13);
      this.servos['yaw'] = new five.Servo({
        id : 'yaw',
        pin : 3,
        range: [30, 150],
        startAt: 90
      });
      this.servos['right'] = new five.Servo({
        id : 'right',
        pin : 6,
        range: [30, 150],
        startAt: 90
      });
      this.servos['left'] = new five.Servo({
        id : 'left',
        pin : 9,
        range: [30, 150],
        startAt: 90
      });
      this.isActive = true;
    });
  }

  changeLedStatus(status) {
    debug(`change LED status: ${status}`)
    if(!this.isActive) return;
    this.io.sockets.emit('ledStatus', this.ledStatus);
    this.status = status;
    if(status == 'on') {
      console.log('turn on led...');
      this.led.on();
    } else if (status == 'blink') {
      console.log('blink led...');
      this.led.blink(500);
    } else {
      console.log('turn off led');
      this.led.stop().off();
    }
  }

  servoMove(servoId, deg) {
    debug(`servo move: ${servoId} to ${deg}`)

    if(!this.isActive) return;
    if (deg !== null && deg !== undefined) this.servos[servoId].to(deg);
  }

  servoAction(yaw_d, right_d, left_d, movetime) {
    debug(`servo action, yaw: ${yaw_d}, right: ${right_d}, left: ${left_d}`)

    if(!this.isActive) return;
    this.servos.yaw.to(yaw_d, movetime);
    this.servos.right.to(right_d, movetime);
    this.servos.left.to(left_d, movetime);
  }

  servoCommand(board, command, yaw, right, left) {
    if(!this.isActive) return;
    let time = 0;
    if (command == 'name') {
      this.servoMove(yaw, 10);
      this.servoAction(yaw, 10, right, 100, left, 90, 1000);
    } else if (command == 'what') {
      console.log('command what');
      this.servoAction(yaw, 80, right, 70, left, 50, 1000);
      this.board.wait(time, function() {
        this.servoAction(yaw, 60, right, 90, left, 90, 1000);
      });
    }
  }

  servoStop(){
    debu('servo stop');
    if(!this.isActive) return;

    this.servos.yaw.stop();
    this.servos.right.stop();
    this.servos.left.stop();
    time = 0;
  }

  wait(time, callback) {
    debug(`waiting ${time} ms, callback: ${callback}`);
    return new Promise((res, rej) => {
      setTimeout(() => {
        debug('awake');
        if(callback) {
          debug(`do callback`);
          callback();
        }
        res();
      }, time);
    });
  }
}

module.exports = BoardManager;
