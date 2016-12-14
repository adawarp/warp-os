'use strict';

class BoardManager {

  constructor(io) {
    //this.ledStatus = false;
    this.io = io;
  }

  changeLedStatus(ledStatus) {
    this.ledStatus = ledStatus;
    this.io.sockets.emit('ledStatus', this.ledStatus);
  }

  ledStatus(led, status) {
    this.led = led;
    this.status = status;
    if(status == 'on') {
      console.log('turn on led...');
      led.on();
    } else if (status == 'blink') {
      console.log('blink led...');
      led.blink(500);
    } else {
      console.log('turn off led');
      led.stop().off();
    }
  }
}

module.exports = BoardManager;
