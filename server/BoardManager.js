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
    debug(`change LED status: ${status}`);
    if(!this.isActive) return;
    this.io.sockets.emit('ledStatus', this.ledStatus);
    this.status = status;
    if(status == 'on') {
      this.led.on();
    } else if (status == 'blink') {
      this.led.blink(500);
    } else {
      this.led.stop().off();
    }
  }

  servoMove(servoId, deg) {
    debug(`servo move: ${servoId} to ${deg}`);

    if(!this.isActive) return;
    if (deg !== null && deg !== undefined) this.servos[servoId].to(deg);
  }

  servoAction(yaw_d, right_d, left_d, time) {
    return () => {
      return new Promise((res) => {
        debug(`servo action, yaw: ${yaw_d}, right: ${right_d}, left: ${left_d}, time: ${time} ms`);

        if(this.isActive) {
          this.servos.yaw.to(yaw_d, time);
          this.servos.right.to(right_d, time);
          this.servos.left.to(left_d, time);
        }
        this.wait(time)()
      .then(res);
      });
    };
  }

  servoStop(){
    debug('servo stop');
    if(!this.isActive) return;

    this.servos.yaw.stop();
    this.servos.right.stop();
    this.servos.left.stop();
  }

  wait(time) {
    return () => {
      debug(`waiting ${time} ms`);
      return new Promise((res) => {
        setTimeout(() => {
          debug('awake');
          res();
        }, time);
      });
    };
  }
}

module.exports = BoardManager;
