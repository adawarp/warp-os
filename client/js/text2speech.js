/* global Phrases: false, io: false */
var socket = io();
var currentLang = 'ja';

window.onload = function(){
  socket = io.connect();
  initQuestionList(Languages.ja.dict);
};

window.onbeforeunload = function() {
  window.speechSynthesis.cancel();
};

var Languages = {
  ja : {
    dict: PhrasesJa,
    code: 'ja-JP'
  },
  en : {
    dict: PhrasesEn,
    code: 'en-US'
  },
  cn : {
    dict: PhrasesCn,
    code: 'zh-CN'
  }
}

function initQuestionList(phrases) {
  var rootElement = document.getElementById('question-list');
  rootElement.textContent = null;
  for (var key in phrases) {
    rootElement.appendChild(buildQuestionButton(phrases, key));
  }
}

function sellang() {
  window.speechSynthesis.cancel();
  var pullSellect = document.setting.language.selectedIndex;
  var lang = document.setting.language.options[pullSellect].value;
  initQuestionList(Languages[lang].dict);
  currentLang = lang;
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
  msg.lang = Languages[currentLang].code; //言語

  msg.onstart = function(){
    document.getElementById(data.id).disabled = 'disabled';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = 'disabled';
    }
  };
  //---todo:FireFox specific code
  msg.onend = function(){
    document.getElementById(data.id).disabled = '';
    var list = document.querySelectorAll( 'button' );
    for (var item of list) {
      item.disabled = '';
    }
  };
  window.speechSynthesis.speak(msg);
  //socket.emit('speech', data.id);
}