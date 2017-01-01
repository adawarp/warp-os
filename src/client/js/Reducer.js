/* vim: set ft=javascript expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import Debug from 'debug';

const debug = Debug('wos:reducer');

const initialState = {
  ledStatus: 'on',
  yaw: 90,
  left: 90,
  right: 90,
  currentLanguage: 'ja',
  speaking: false,
  myId: '',
  remoteId: '',
  localStream: null,
  remoteStream: null,
  connection: null,
  data: []
};

export function reducer(state = initialState, action) {
  debug(state, action);
  let nextState = null;
  switch (action.type) {
  case 'LED_BUTTON_CLICKED':
    return Object.assign({}, state, { ledStatus: action.status });
  case 'SERVO_ANGLE_CHANGED':
    nextState = Object.assign({}, state);
    nextState[action.servo] = action.angle;
    return nextState;
  case 'LANGUAGE_SELECTED':
    return Object.assign({}, state, { currentLanguage: action.lang});
  case 'START_SPEAKING':
    return Object.assign({}, state, { speaking: true });
  case 'STOP_SPEAKING':
    return Object.assign({}, state, { speaking: false });
  case 'CONNECT_TO_PEER':
    return Object.assign({}, state, { remoteId: action.remoteId });
  case 'RETRIEVE_ID':
    return Object.assign({}, state, { myId: action.myId});
  case 'RETRIEVE_REMOTE_ID':
    return Object.assign({}, state, { remoteId: action.remoteId});
  case 'RECEIVE_LOCAL_STREAM':
    return Object.assign({}, state, { localStream: action.stream});
  case 'RECEIVE_REMOTE_STREAM':
    return Object.assign({}, state, { remoteStream: action.stream});
  case 'RECEIVE_DATA':
    return Object.assign({}, state, { data: state.data.concat(action.data) });
  default:
    return state;
  }
}

