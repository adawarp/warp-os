/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';
import { connect } from 'react-redux';
import Debug from 'debug';

const debug = Debug('wos:adawarp');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class _AdawarpView extends React.Component {
  constructor(props) {
    super(props);

    this.startCall = () => {
      let partnerId = this.refs['remoteId'].value;
      debug(`start calling to ${partnerId}`);
      if (!partnerId) {
        alert('type your partner id');
        return;
      }

      if (!this.props.localStream) {
        alert('permit user media');
        return;
      }

      const conn = this.props.peer.call(partnerId, this.props.localStream);
      this.props.createP2PConnection(conn);
      conn.on('stream', (stream) => {
        debug('receive stream');
        this.props.retrieveRemoteId(partnerId);
        this.props.receiveRemoteStream(stream);
      });
    };

    this.endCall = () => {
      debug('end call');
      const conn = this.props.connection;
      if (conn) {
        conn.close();
        this.props.removeConnection();
      }
    };

    this.initLocalVideo = () => {
      navigator.getUserMedia({audio: true, video: true}, (stream) => {
        this.props.receiveLocalStream(stream);
      }, (error) => {
        debug(error);
        alert('Error!');
      });
    };
  }

  componentDidMount() {
    const peer = this.props.peer;
    this.initLocalVideo();

    peer.on('open', (info) => {
      debug(`connect to signaling server, login as ${info}`);
      this.props.retrieveId(info.id);
    });

    peer.on('connection', (conn) => {
      debug(`receive connection from ${conn.peer}`);
      this.props.createP2PConnection(conn);
      this.props.connectToPeer(conn.peer);
      conn.on('data', (data) => {
        this.props.receiveData(data);
        this.props.socket.emit('command', JSON.parse(data));
      });
    });

    peer.on('call', (conn) => {
      debug(`receive call from ${conn.peer}`);
      if (!this.props.localStream) {
        alert('permit user media');
        return;
      }
      this.props.createP2PConnection(conn);
      this.props.retrieveRemoteId(conn.peer);
      conn.on('stream', (stream) => {
        debug('receive stream');
        this.props.receiveRemoteStream(stream);
      });
      conn.answer(this.props.localStream);
    });

    this.props.peer.login();
  }

  render() {
    return (
      <div>
        <div>
          <input ref="remoteId" type="text" placeholder="Input partner ID" />
          <button onClick={this.startCall}>Start Call</button>
          <button onClick={this.endCall}>End Call</button>
        </div>

        <div>
          <p>MyID: {this.props.myId}</p>
          <p>PartnerID: {this.props.remoteId}</p>
        </div>
        <div>
          <video autoPlay muted src={this.props.localStream ? URL.createObjectURL(this.props.localStream) : ''} ></video>
          <video autoPlay src={this.props.remoteStream ? URL.createObjectURL(this.props.remoteStream) : ''} ></video>
        </div>

        <div id="controller"></div>
        <div id="receive_message"></div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    connectToPeer: (remoteId) => {
      dispatch({
        type: 'CONNECT_TO_PEER',
        remoteId
      });
    },
    retrieveId: (myId) => {
      dispatch({
        type: 'RETRIEVE_ID',
        myId
      });
    },
    retrieveRemoteId: (remoteId) => {
      dispatch({
        type: 'RETRIEVE_REMOTE_ID',
        remoteId
      });
    },
    receiveData: (data) => {
      dispatch({
        type: 'RECEIVE_DATA',
        data
      });
    },
    receiveLocalStream: (stream) => {
      dispatch({
        type: 'RECEIVE_LOCAL_STREAM',
        stream
      });
    },
    receiveRemoteStream: (stream) => {
      dispatch({
        type: 'RECEIVE_REMOTE_STREAM',
        stream
      });
    },
    closeConnection: () => {
      dispatch({
        type: 'CLOSE_CONNECTION'
      });
    },
    createP2PConnection: (connection) => {
      dispatch({
        type: 'CREATE_CONNECTION',
        connection
      });
    }
  };
}

export const AdawarpView = connect(mapStateToProps, mapDispatchToProps)(_AdawarpView);

