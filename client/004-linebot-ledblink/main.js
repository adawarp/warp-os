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
    ledStatus(JSON.parse(data));
  });
});

function ledStatus(status) {
  let on_btn = document.getElementById('on_btn');
  let off_btn = document.getElementById('off_btn');
  socket.emit('ledStatus', status);
  colorSwitcher(status);
}

function colorSwitcher (status) {
  if(status) {
    on_btn.style.backgroundColor = 'red';
    off_btn.style.backgroundColor = '#4CAF50';
  } else {
    on_btn.style.backgroundColor = '#4CAF50';
    off_btn.style.backgroundColor = 'red';
  }
}

function callStart(){
  partner_id = document.getElementById("partner-id-input").value;
  conn = peer.connect(partner_id);
}