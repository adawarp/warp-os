/* vim: set ft=javascript.jsx expandtab sw=2 sts=2 ff=unix fenc=utf-8 : */

import React from 'react';

import { LEDButton } from './LEDButton.jsx';
import { ServoAngleSlider } from './ServoAngleSlider.jsx';

export class DeviceManager extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    const config = { min:30, max: 150, defaultValue: 90, step: 1 };
    return (
      <div>
        <hr />
        <h1>Device Manager</h1>
        <LEDButton {...this.props} mode="on" text="On" />
        <LEDButton {...this.props} mode="off" text="Off" />
        <LEDButton {...this.props} mode="blink" text="Blink" />
        <ServoAngleSlider {...this.props} config={config} name="yaw" />
        <ServoAngleSlider {...this.props} config={config} name="right" />
        <ServoAngleSlider {...this.props} config={config} name="left" />
      </div>
    );
  }
}

