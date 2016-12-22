/* global Adawarp: false, io: false */

let ledButtons = {},
  lastSelectedButtonIndex,
  servoYawSlider, servoRightSlider, servoLeftSlider,
  servoView = {},
  conn, socket, peer = new Adawarp();

window.onload = function(){
  socket = io.connect();
  ledButtons['on'] = document.getElementById('on_btn');
  ledButtons['off'] = document.getElementById('off_btn');
  ledButtons['blink'] = document.getElementById('blink_btn');

  servoYawSlider = document.getElementById('yaw_slider');
  servoRightSlider = document.getElementById('right_slider');
  servoLeftSlider = document.getElementById('left_slider');

  servoView['yaw'] = document.getElementById('yaw');
  servoView['right'] = document.getElementById('right');
  servoView['left'] = document.getElementById('left');

  for(let key in ledButtons) {
    ((index) => {
      ledButtons[index].onclick = () => {
        changeLedStatus(index);
      };
    })(key);
  }

  servoYawSlider.oninput = handleSliderChanged;
  servoRightSlider.oninput = handleSliderChanged;
  servoLeftSlider.oninput = handleSliderChanged;

  peer.on('open', function(){
  });
  peer.login();
  changeLedStatus('on');
};

peer.on('connection', function(conn) {
  document.getElementById('partner_id').innerHTML = conn.peer;
  conn.on('data', function(data){
    document.getElementById('receive_message').innerHTML = data;
    socket.emit('command', JSON.parse(data));
  });
});

function startCall(){
  let partnerId = document.getElementById('partner-id-input').value;
  conn = peer.connect(partnerId);
}

function changeLedStatus(status) {
  socket.emit('ledStatus', status);
  changeButtonColor(status);
}

function changeButtonColor(index) {
  if (lastSelectedButtonIndex === index) {
    return;
  }
  if (ledButtons.hasOwnProperty(lastSelectedButtonIndex)) {
    ledButtons[lastSelectedButtonIndex].classList.remove('pressed');
    ledButtons[lastSelectedButtonIndex].classList.add('released');
  }
  ledButtons[index].classList.remove('released');
  ledButtons[index].classList.add('pressed');
  lastSelectedButtonIndex = index;
}

function handleSliderChanged(event) {
  let angle = event.target.value;
  let servo = event.target.dataset.servo;
  servoView[servo].value = angle;
  sendServoAngle(servo, angle);
}
function sendServoAngle(servo, angle) {
  socket.emit('servo', {
    servo :`servo_${servo}`,
    vol : angle
  });
}
