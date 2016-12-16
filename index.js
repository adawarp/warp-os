'use strict';
const PORT = 4222;

const fs = require('fs');
const debug = require('debug')('create2:driver');

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

const BoardManager = require('./server/BoardManager.js');
const board = new BoardManager(io);

//--HACK: This is fucking code. need refactoring ASAP!!!
io.sockets.on('connection', (socket) => {
  console.log('hello socket');
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
      board.servoAction(90, 10, 50, 1000);
      move0();
    } else if (command == 'morning') {
      console.log('command morning');
      board.servoAction(80, 70, 50, 1000);
      move2();
      board.wait(3000, function() {
        board.servoAction(120, 70, 80, 1000);
      });
    }
    else if (command == 'what') {
      console.log('command what');
      board.servoAction(80, 70, 50, 1000);
      move1();
      board.wait(3000, function() {
        board.servoAction(120, 70, 80, 1000);
      });
    } else if (command == 'who') {
      console.log('command what');
      board.servoAction(90, 90, 90, 1000);
      move2();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'how-much') {
      console.log('command how-much');
      board.servoAction(90, 10, 50, 1000);
      move2();
    } else if (command == 'business') {
      console.log('command business');
      board.servoAction(90, 10, 50, 1000);
      move3();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'rich') {
      console.log('command rich');
      board.servoAction(90, 90, 90, 1000);
      move4();
      board.wait(3000, function() {
        board.servoAction(90, 90, 90, 1000);
      });
    } else if (command == 'danbo') {
      console.log('command danbo');
      board.servoAction(30, 90, 90, 1000);
      move3();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'touch') {
      console.log('command touch');
      board.servoAction(30, 90, 90, 1000);
      move1();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'weather') {
      console.log('command weather');
      board.servoAction(10, 90, 90, 1000);
      move4();
      board.wait(4000, function() {
        board.servoAction(10, 90, 80, 1000);
      });
    } else if (command == 'amazing') {
      console.log('command amazing');
      board.servoAction(30, 90, 90, 1000);
      move4();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    }  else if (command == 'document') {
      console.log('command document');
      board.servoAction(30, 90, 90, 1000);
      move1();
      board.wait(3000, function() {
        board.servoAction(90, 70, 80, 1000);
      });
    } else if (command == 'noperson') {
      console.log('command noperson');
      board.servoAction(10, 90, 90, 1000);
      move3();
      board.wait(4000, function() {
        board.servoAction(10, 90, 80, 1000);
      });
    }
  });

});

function move0() {
  board.wait(1000, function() {
    board.servoAction(90, 90, 90, 1000);
  });
  board.wait(2000, function() {
    board.servoAction(10, 80, 100, 1000);
  });
}

function move1() {
  board.wait(1000, function() {
    board.servoAction(60, 90, 90, 1000);
  });
  board.wait(2000, function() {
    board.servoAction(80, 70, 50, 1000);
  });
}

function move2() {
  board.wait(1000, function() {
    board.servoAction(100, 100, 100, 1000);
  });
  board.wait(2000, function() {
    board.servoAction(90, 90, 70, 1000);
  });
}

function move3() {
  board.wait(1000, function() {
    board.servoAction(20, 90, 90, 1000);
  });
  board.wait(2000, function() {
    board.servoAction(120, 70, 50, 1000);
  });
}

function move4() {
  board.wait(1000, function() {
    board.servoAction(10, 90, 90, 1000);
  });
  board.wait(2000, function() {
    board.servoAction(150, 90, 90, 1000);
  });
}