
/* global Phrases: false, io: false */
var socket = io();

window.onload = function(){
  socket = io.connect();
  initQuestionList();

};

function initQuestionList() {
  var rootElement = document.getElementById('question-list');
  for (var key in Phrases) {
    rootElement.appendChild(buildQuestionButton(Phrases, key));
  }
}

function buildQuestionButton(phrases, key) {
  var button = document.createElement('button');
  button.id = key;
  button.class = 'questionee';
  button.onclick = function() {
    talk({id: key, script: Phrases[key].answer});
  };
  button.textContent = Phrases[key].question;
  return button;
}


function talk(data) {
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1; //ボリューム
  msg.rate = 0.9;  //レート
  msg.pitch = 1; //ピッチ
  msg.text = data.script;
  msg.lang = 'ja-JP'; //言語

  msg.onstart = function(){
    console.log('hello start');
    document.getElementById(data.id).disabled = 'disabled';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      console.log(item);
      item.disabled = 'disabled';
    }
  };
  msg.onend = function(){
    console.log('hello fin');
    document.getElementById(data.id).disabled = '';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = '';
    }
  };
  window.speechSynthesis.speak(msg);
  socket.emit('speech', data.id);
}