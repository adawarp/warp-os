/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';
import { connect } from 'react-redux';

class _ServoAngleSlider extends React.Component {

  constructor() {
    super();
  }

  render() {
    const config = this.props.config;
    return (
      <div>
        <label>{this.props.name}</label>
        <input
          type="range"
          onChange={this.props.handleSliderChanged(this.props.name, this.props.socket)}
          min={config.min}
          max={config.max}
          defaultValue={config.defaultValue}
          step={config.step} />
        <output >{this.props[this.props.name]}</output>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    handleSliderChanged: (servo, socket) => {
      return (event) => {
        const angle = Number(event.target.value);
        socket.emit('servo', {
          servo :`servo_${servo}`,
          vol : angle
        });
        dispatch({
          type: 'SERVO_ANGLE_CHANGED',
          servo,
          angle
        });
      };
    }
  };
}

export const ServoAngleSlider = connect(mapStateToProps, mapDispatchToProps)(_ServoAngleSlider);

