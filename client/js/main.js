/* global Adawarp: false, io: false */

let ledOnButton, ledOffButton, ledBlinkButton,
  servoYawSlider, servoRightSlider, servoLeftSlider,
  servoView = {},
  conn, socket, peer = new Adawarp();

window.onload = function(){
  socket = io.connect();
  ledOnButton = document.getElementById('on_btn');
  ledOffButton = document.getElementById('off_btn');
  ledBlinkButton = document.getElementById('blink_btn');

  servoYawSlider = document.getElementById('yaw_slider');
  servoRightSlider = document.getElementById('right_slider');
  servoLeftSlider = document.getElementById('left_slider');

  servoView['yaw'] = document.getElementById('yaw');
  servoView['right'] = document.getElementById('right');
  servoView['left'] = document.getElementById('left');

  ledOnButton.onclick = () => {
    changeLedStatus('on');
  };
  ledOffButton.onclick = () => {
    changeLedStatus('off');
  };
  ledBlinkButton.onclick = () => {
    changeLedStatus('blink');
  };

  servoYawSlider.oninput = handleSliderChanged;
  servoRightSlider.oninput = handleSliderChanged;
  servoLeftSlider.oninput = handleSliderChanged;

  peer.on('open', function(){
  });
  peer.login();
  changeLedStatus(false);
};

peer.on('connection', function(conn) {
  document.getElementById('partner_id').innerHTML = conn.peer;
  conn.on('data', function(data){
    console.log(data);
    document.getElementById('receive_message').innerHTML = data;
    socket.emit('command', JSON.parse(data));
  });
});

function callStart(){
  let partnerId = document.getElementById('partner-id-input').value;
  conn = peer.connect(partnerId);
}

function changeLedStatus(status) {
  socket.emit('ledStatus', status);
  changeButtonColor(status);
}

function changeButtonColor(status) {
  if(status == 'on') {
    ledOnButton.style.backgroundColor = 'red';
    ledBlinkButton.style.backgroundColor = '#4CAF50';
    ledOffButton.style.backgroundColor = '#4CAF50';
  } else if (status == 'blink') {
    ledOnButton.style.backgroundColor = '#4CAF50';
    ledBlinkButton.style.backgroundColor = 'red';
    ledOffButton.style.backgroundColor = '#4CAF50';
  } else {
    ledOnButton.style.backgroundColor = '#4CAF50';
    ledBlinkButton.style.backgroundColor = '#4CAF50';
    ledOffButton.style.backgroundColor = 'red';
  }
}

function handleSliderChanged(event) {
  let angle = event.target.value;
  let servo = event.target.dataset.servo;
  servoView[servo].value = angle;
  outputUpdate(servo, angle);
}

function outputUpdate(servo, angle) {
  socket.emit('servo', {
    servo :`servo_${servo}`,
    vol : angle
  });
}
