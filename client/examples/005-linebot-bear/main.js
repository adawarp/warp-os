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