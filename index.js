'use strict';
const PORT = 4222;

//Server settings
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));

http.listen(PORT, function(){
  console.log('Listen on ',PORT);
});

//Johnny-Five
const five = require('johnny-five');
const board = new five.Board({'repl':false});
const BoardManager = require('./server/BoardManager.js');
const boardManager = new BoardManager(io);

//--HACK: Do I need to set these values in here?
let led = null;
let servo_yaw = 90;
let servo_right = 90;
let servo_left = 90;

//--HACK: Tatsuki does not know how to set up these setting out of index.js
board.on('ready', function() {
  console.log('hello board');
  led = new five.Led(13);
  servo_yaw = new five.Servo({
    id : 'yaw',
    pin : 3,
    range: [30, 150],
    startAt: 90
  });
  servo_right = new five.Servo({
    id : 'right',
    pin : 6,
    range: [30, 150],
    startAt: 90
  });
  servo_left = new five.Servo({
    id : 'left',
    pin : 9,
    range: [30, 150],
    startAt: 90
  });
});

//--HACK: This is fucking code. need refactoring ASAP!!!
io.sockets.on('connection', function(socket) {
  console.log('hello socket');
  socket.on('ledStatus', function(status) {
    boardManager.ledStatus(led, status);
  });
  socket.on('servo', function(data) {
    if (data.servo == 'servo_yaw') {
      boardManager.servoMove(servo_yaw, data.vol);
    } else if (data.servo == 'servo_right') {
      boardManager.servoMove(servo_right, data.vol);
    } else if (data.servo == 'servo_left') {
      boardManager.servoMove(servo_left, data.vol);
    }
  });
  socket.on('speech', function(command) {
    if (command == 'name') {
      servoAction(90, 10, 50, 1000);
      move0();
    } else if (command == 'morning') {
      console.log('command morning');
      servoAction(80, 70, 50, 1000);
      move2();
      board.wait(3000, function() {
        servoAction(120, 70, 80, 1000);
      });
    }
    else if (command == 'what') {
      console.log('command what');
      servoAction(80, 70, 50, 1000);
      move1();
      board.wait(3000, function() {
        servoAction(120, 70, 80, 1000);
      });
    } else if (command == 'who') {
      console.log('command what');
      servoAction(90, 90, 90, 1000);
      move2();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'how-much') {
      console.log('command how-much');
      servoAction(90, 10, 50, 1000);
      move2();
    } else if (command == 'business') {
      console.log('command business');
      servoAction(90, 10, 50, 1000);
      move3();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'rich') {
      console.log('command rich');
      servoAction(90, 90, 90, 1000);
      move4();
      board.wait(3000, function() {
        servoAction(90, 90, 90, 1000);
      });
    } else if (command == 'danbo') {
      console.log('command danbo');
      servoAction(30, 90, 90, 1000);
      move3();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'touch') {
      console.log('command touch');
      servoAction(30, 90, 90, 1000);
      move1();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'weather') {
      console.log('command weather');
      servoAction(10, 90, 90, 1000);
      move4();
      board.wait(4000, function() {
        servoAction(10, 90, 80, 1000);
      });
    } else if (command == 'amazing') {
      console.log('command amazing');
      servoAction(30, 90, 90, 1000);
      move4();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    }  else if (command == 'document') {
      console.log('command document');
      servoAction(30, 90, 90, 1000);
      move1();
      board.wait(3000, function() {
        servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'noperson') {
      console.log('command noperson');
      servoAction(10, 90, 90, 1000);
      move3();
      board.wait(4000, function() {
        servoAction(10, 90, 80, 1000);
      });
    }
  });

});

function servoMove(servo, deg) {
  console.log(servo.id + ':' + deg);
  if (deg !== null && deg !== undefined) servo.to(deg);
}

function servoAction(yaw_d, right_d, left_d, movetime) {
  servo_yaw.to(yaw_d, movetime);
  servo_right.to(right_d, movetime);
  servo_left.to(left_d, movetime);
}

function move0() {
  board.wait(1000, function() {
    servoAction(90, 90, 90, 1000);
  });
  board.wait(2000, function() {
    servoAction(10, 80, 100, 1000);
  });
}

function move1() {
  board.wait(1000, function() {
    servoAction(60, 90, 90, 1000);
  });
  board.wait(2000, function() {
    servoAction(80, 70, 50, 1000);
  });
}

function move2() {
  board.wait(1000, function() {
    servoAction(100, 100, 100, 1000);
  });
  board.wait(2000, function() {
    servoAction(90, 90, 70, 1000);
  });
}

function move3() {
  board.wait(1000, function() {
    servoAction(20, 90, 90, 1000);
  });
  board.wait(2000, function() {
    servoAction(120, 70, 50, 1000);
  });
}

function move4() {
  board.wait(1000, function() {
    servoAction(10, 90, 90, 1000);
  });
  board.wait(2000, function() {
    servoAction(150, 90, 90, 1000);
  });
}