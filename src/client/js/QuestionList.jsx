/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';
import { connect } from 'react-redux';

import cn from './phrases_cn';
import ja from './phrases_ja';
import en from './phrases_en';

const Languages = {
  ja, cn, en
};

class _QuestionList extends React.Component {
  constructor() {
    super();
  }

  render() {
    const
      lang = this.props.currentLanguage,
      phrases = Languages[lang].dict,
      options = [],
      questions = []
      ;
    for (let key in Languages) {
      options.push(
        <option
          value={key}
          key={key}>
          {Languages[key].name}
        </option>
      );
    }

    for (let key in phrases) {
      questions.push(
        <button
          key={key}
          className={this.props.speaking ? 'disabled' : 'enabled'}
          disabled={this.props.speaking ? 'disabled' : ''}
          onClick={this.props.ask(lang, key)}>
          { phrases[key].question }
            </button>
      );
    }
    return (
      <div>
        <h1>しつもんにこたえるよ</h1>
        <select
          onChange={this.props.selectLanguage}
          defaultValue={lang}>
          {options}
        </select>
        <div id="question-list"></div>
        {questions}
        <hr />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    selectLanguage: (event) => {
      window.speechSynthesis.cancel();
      const lang = event.target.selectedOptions[0].value;
      dispatch({
        type: 'LANGUAGE_SELECTED',
        lang
      });
    },
    ask: (lang, question) => {
      return () => {
        talk(lang, Languages[lang].dict[question], dispatch);
        dispatch({
          type: 'QUESTION_CLICKED',
          lang,
          question
        });
      };
    }
  };
}

window.addEventListener('beforeunload', function() {
  window.speechSynthesis.cancel();
});

function talk(lang, question, dispatch) {
  window.speechSynthesis.resume();
  let msg = new SpeechSynthesisUtterance();
  msg.volume = 1;
  msg.rate = 0.9;
  msg.pitch = 1;
  msg.text = question.answer;
  msg.lang = Languages[lang].code;

  msg.onstart = function() {
    dispatch({
      type: 'START_SPEAKING'
    });
  };
  //---todo:FireFox specific code
  msg.onend = function() {
    dispatch({
      type: 'STOP_SPEAKING'
    });

  };
  window.speechSynthesis.speak(msg);
}
export const QuestionList = connect(mapStateToProps, mapDispatchToProps)(_QuestionList);
