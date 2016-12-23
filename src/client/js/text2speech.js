/* global io: false */
let currentLang = 'ja';

if (!('Languages' in window)) {
  window.Languages = {};
}

window.addEventListener("beforeunload", function() {
  window.speechSynthesis.cancel();
});

function initLanguageList(languages) {
  let rootElement = document.getElementById('language-list');
  rootElement.innerHTML = null;
  for (let key in languages) {
    rootElement.appendChild(buildLanguageOptionElement(languages, key, key === currentLang));
  }

  rootElement.onchange = selectLang;
}

function initQuestionList(phrases) {
  let rootElement = document.getElementById('question-list');
  rootElement.textContent = null;
  for (let key in phrases) {
    rootElement.appendChild(buildQuestionButton(phrases, key));
  }

}

function selectLang() {
  window.speechSynthesis.cancel();
  let selectedLang = document.setting.language.selectedOptions[0].value;
  initQuestionList(window.Languages[selectedLang].dict);
  currentLang = selectedLang;
}

function buildLanguageOptionElement(languages, key, isSelected) {
  let option = document.createElement('option');
  option.value = key;
  option.textContent = languages[key].name;
  option.selected = isSelected;
  return option;
}
function buildQuestionButton(phrases, key) {
  let button = document.createElement('button');
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
  let msg = new SpeechSynthesisUtterance();
  msg.volume = 1;
  msg.rate = 0.9;
  msg.pitch = 1;
  msg.text = data.script;
  msg.lang = window.Languages[currentLang].code;

  msg.onstart = function(){
    document.getElementById(data.id).disabled = 'disabled';
    let list = document.querySelectorAll( 'button' );
    for (let item of list) {
      item.disabled = 'disabled';
    }

  };
  //---todo:FireFox specific code
  msg.onend = function(){
    document.getElementById(data.id).disabled = '';
    let list = document.querySelectorAll( 'button' );
    for (let item of list) {
      item.disabled = '';
    }

  };
  window.speechSynthesis.speak(msg);
}
