var socket = io();
var peer = new Adawarp();
var conn;

window.onload = function(){
  socket = io.connect();
  peer.on('open', function(){
    document.getElementById("my_id").innerHTML = peer.id;
  });
  peer.login();
  ledStatus(false);
};

peer.on('connection', function(conn) {
  document.getElementById("partner_id").innerHTML = conn.peer;
  conn.on('data', function(data){
    console.log(data);
    document.getElementById("receive_message").innerHTML = data;
    socket.emit('command', JSON.parse(data));
  });
});

function callStart(){
  partner_id = document.getElementById("partner-id-input").value;
  conn = peer.connect(partner_id);
}

function ledStatus(status) {
  let on_btn = document.getElementById('on_btn');
  let blink_btn = document.getElementById('blink_btn');
  let off_btn = document.getElementById('off_btn');
  socket.emit('ledStatus', status);
  colorSwitcher(status);
}

function colorSwitcher (status) {
  if(status == 'on') {
    console.log('led on...');
    on_btn.style.backgroundColor = 'red';
    blink_btn.style.backgroundColor = '#4CAF50';
    off_btn.style.backgroundColor = '#4CAF50';
  } else if (status == 'blink') {
    console.log('led blink...');
    on_btn.style.backgroundColor = '#4CAF50';
    blink_btn.style.backgroundColor = 'red';
    off_btn.style.backgroundColor = '#4CAF50';
  } else {
    console.log('led off...');
    on_btn.style.backgroundColor = '#4CAF50';
    blink_btn.style.backgroundColor = '#4CAF50';
    off_btn.style.backgroundColor = 'red';
  }
}