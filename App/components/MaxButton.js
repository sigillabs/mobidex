import React, { Component } from 'react';
import SmallClearButton from './SmallClearButton';

export default class MaxButton extends Component {
  render() {
    return <SmallClearButton title={'max'} {...this.props} />;
  }
}
