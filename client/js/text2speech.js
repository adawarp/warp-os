/* global Phrases: false, io: false */
var socket = io();
var lng_now = 'ja';

window.onload = function(){
  socket = io.connect();
  initQuestionList(PhrasesJa);
};

window.onbeforeunload = function() {
  window.speechSynthesis.cancel();
};

var phrase_list = {
  ja : PhrasesJa,
  en : PhrasesEn,
  cn : PhrasesCn
}

var lng_code = {
  ja : 'ja-JP',
  en : 'en-US',
  cn : 'zh-CN'
}

function initQuestionList(Phrases) {
  var rootElement = document.getElementById('question-list');
  rootElement.textContent = null;
  for (var key in Phrases) {
    rootElement.appendChild(buildQuestionButton(Phrases, key));
  }
}

function sellng() {
  window.speechSynthesis.cancel();
  pullSellect = document.pullForm.language.selectedIndex;
  lng = document.pullForm.language.options[pullSellect].value;
  initQuestionList(phrase_list[lng]);
  lng_now = lng;
}

function buildQuestionButton(phrases, key) {
  var button = document.createElement('button');
  button.id = key;
  button.class = 'questionee';
  button.onclick = function() {
    talk({id: key, script: phrases[key].answer});
  };
  button.textContent = phrases[key].question;
  return button;
}

function talk(data) {
  window.speechSynthesis.resume();
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1; //ボリューム
  msg.rate = 0.9;  //レート
  msg.pitch = 1; //ピッチ
  msg.text = data.script;
  msg.lang = lng_code[lng_now]; //言語

  msg.onstart = function(){
    console.log('start');
    document.getElementById(data.id).disabled = 'disabled';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = 'disabled';
    }
  };
  //---todo:FireFox specific code
  msg.onend = function(){
    console.log('end');
    document.getElementById(data.id).disabled = '';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = '';
    }
  };
  window.speechSynthesis.speak(msg);
  //socket.emit('speech', data.id);
}