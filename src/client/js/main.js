/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Adawarp } from 'adawarp';
import * as io from 'socket.io-client';

import { QuestionList } from './QuestionList.jsx';
import { DeviceManager } from './DeviceManager.jsx';
import { AdawarpView } from './AdawarpView.jsx';
import { reducer } from './Reducer.js';

const store = createStore(reducer);

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
        <AdawarpView {...this.props} />
        <QuestionList {...this.props} />
        <DeviceManager {...this.props} />
      </div>
    );
  }
}
window.addEventListener('DOMContentLoaded', function() {
  const socket = io.connect('http://localhost:4222');
  const peer = new Adawarp();
  render(
    <Provider store={store}>
      <App socket={socket} peer={peer} />
    </Provider>,
    document.getElementById('mount-point'));
});

