'use strict';

class BoardManager {

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
  servoMove(servo, deg){
    console.log(servo.id + ':' + deg);
    if (deg !== null && deg !== undefined) servo.to(deg);
  }
}

module.exports = BoardManager;
