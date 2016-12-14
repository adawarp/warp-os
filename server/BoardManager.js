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

  servoMove(servo, deg) {
    console.log(servo.id + ':' + deg);
    if (deg !== null && deg !== undefined) servo.to(deg);
  }

  servoAction(yaw, yaw_d, right, right_d, left, left_d, movetime) {
    yaw.to(yaw_d, movetime);
    right.to(right_d, movetime);
    left.to(left_d, movetime);
  }

  servoCommand(board, command, yaw, right, left) {
    let time = 0;
    if (command == 'name') {
      this.servoMove(yaw, 10);
      this.servoAction(yaw, 10, right, 100, left, 90, 1000);
    } else if (command == 'what') {
      console.log("command what");
      this.servoAction(yaw, 80, right, 70, left, 50, 1000);
      this.board.wait(time, function() {
        this.servoAction(yaw, 60, right, 90, left, 90, 1000);
      });
    }

    /*switch (command) {
      case "name":
        console.log("command:" + command);
        this.servoMove(yaw, 10);
        this.servoAction(yaw, 10, right, 100, left, 90, 1000);
        break;
      case "what" :
        console.log("command what");
        this.servoAction(yaw, 80, right, 70, left, 50, 1000);
        this.board.wait(time, function() {
          this.servoAction(yaw, 60, right, 90, left, 90, 1000);
        });
        break;
    }*/
  }

  

  servoStop(){
    servo_yaw.stop();
    servo_right.stop();
    servo_left.stop();
    time = 0;
  };
}

module.exports = BoardManager;
