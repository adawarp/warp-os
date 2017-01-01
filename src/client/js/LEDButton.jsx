/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';
import { connect } from 'react-redux';

class _LEDButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <button
        className={this.props.ledStatus === this.props.mode ? 'pressed' : 'released' }
        onClick={this.props.handleLEDButtonClick(this.props.mode, this.props.socket)}>
        {this.props.text}
      </button>
    );
  }
}
function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    handleLEDButtonClick: (button, socket) => {
      return () => {
        socket.emit('ledStatus', status);
        dispatch({
          type: 'LED_BUTTON_CLICKED',
          status: button
        });
      };
    }
  };
}

export const LEDButton = connect(mapStateToProps, mapDispatchToProps)(_LEDButton);
