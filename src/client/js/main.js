/* global Adawarp: false,
          io: false,
          initDeviceManager: false,
          initQuestionList: false,
          initLanguageList: false */

let conn, peer = new Adawarp(), socket = io.connect();

window.addEventListener('DOMContentLoaded', function(){

  peer.on('open', function(){
  });
  peer.login();

  initDeviceManager();
  initQuestionList();
  initLanguageList();
});

peer.on('connection', function(conn) {
  document.getElementById('partner_id').textContent = conn.peer;
  conn.on('data', function(data){
    document.getElementById('receive_message').textContent = data;
    socket.emit('command', JSON.parse(data));
  });
});

function startCall(){
  let partnerId = document.getElementById('partner-id-input').value;
  if (partnerId) {
    conn = peer.connect(partnerId);
  }
}

