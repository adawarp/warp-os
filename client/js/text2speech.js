var socket = io();

window.onload = function(){
  socket = io.connect();
};

function talk(data) {
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1; //ボリューム
  msg.rate = 0.9;  //レート
  msg.pitch = 1; //ピッチ
  msg.text = data.script;
  msg.lang = 'ja-JP'; //言語

  msg.onstart = function(){
    console.log('hello start');
    document.getElementById(data.id).disabled = "disabled";
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      console.log(item);
      item.disabled = "disabled";
    }
  }
  msg.onend = function(){
    console.log('hello fin');
    document.getElementById(data.id).disabled = "";
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = "";
    }
  }
  window.speechSynthesis.speak(msg);
  socket.emit('speech', data.id);
}