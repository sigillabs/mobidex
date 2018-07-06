import React, { Component } from 'react';
import { Text } from 'react-native-elements';

export default class RelayerError extends Component {
  render() {
    const { field, code, reason, ...rest } = this.props;

    if (~reason.toLowerCase().indexOf('below')) {
      return <Text {...rest}>Price or amount is too low</Text>;
    }

    return <Text {...rest}>{reason}</Text>;
  }
}
