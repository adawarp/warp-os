'use strict';
const five = require('johnny-five');
const board = new five.Board({'repl':false});
const debug = require('debug')('warp:board');
const EventEmitter = require('events');
const Records = require('./Records');

class BoardManager extends EventEmitter {

  constructor() {
    super();
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
    this.status = status;
    this.emit('ledStatusChanged', status);
    if(!this.isActive) return;
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

  play(key) {
    if(Records.hasOwnProperty(key)) {
      const record = Records[key];
      debug(`load record : ${record}`);
      let time = 0;
      const operations = record.map((frame) => {
        const promise = this.servoAction(frame.yaw, frame.right, frame.left, frame.time - time);
        time = frame.time;
        return promise;
      });

      return operations.reduce((currentFrame, nextFrame) => {
        return currentFrame.then(nextFrame);
      }, Promise.resolve());
    } else {
      return Promise.reject(`record: "${key}" is not found.`);
    }
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
