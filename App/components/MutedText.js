import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { colors, fonts } from '../../styles';

export default class MutedText extends Component {
  render() {
    let { style } = this.props;

    return (
      <Text style={[{ color: colors.grey1 }, fonts.small, style]}>
        {this.props.children}
      </Text>
    );
  }
}
