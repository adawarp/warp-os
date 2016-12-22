/* global io: false */
var socket = io();
var currentLang = 'ja';

window.onload = function(){
  socket = io.connect();
  initQuestionList(Languages.ja.dict);
  initLanguageList(Languages);
};

window.onbeforeunload = function() {
  window.speechSynthesis.cancel();
};

var Languages = {
  ja : {
    dict: PhrasesJa,
    code: 'ja-JP',
    name: '日本語'
  },
  en : {
    dict: PhrasesEn,
    code: 'en-US',
    name: 'English'
  },
  cn : {
    dict: PhrasesCn,
    code: 'zh-CN',
    name: '中文'
  }
};

function initLanguageList(languages) {
  var rootElement = document.getElementById('language-list');
  for (var key in languages) {
    rootElement.appendChild(buildLanguageOptionElement(languages, key));
  }
  rootElement.onchange = selectLang;
}

function initQuestionList(phrases) {
  var rootElement = document.getElementById('question-list');
  rootElement.textContent = null;
  for (var key in phrases) {
    rootElement.appendChild(buildQuestionButton(phrases, key));
  }
}

function selectLang() {
  window.speechSynthesis.cancel();
  var selectedLang = document.setting.language.selectedOptions[0].value;
  initQuestionList(Languages[selectedLang].dict);
  currentLang = selectedLang;
}

function buildLanguageOptionElement(languages, key, isSelected) {
  var option = document.createElement('option');
  option.value = key;
  option.textContent = languages[key].name;
  option.selected = isSelected;
  return option;
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