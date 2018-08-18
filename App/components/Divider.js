import React, { Component } from 'react';
import { Divider as RNEDivider } from 'react-native-elements';
import { colors } from '../../styles';

export default class Divider extends Component {
  render() {
    return (
      <RNEDivider
        style={[
          { backgroundColor: colors.grey3, marginTop: 10, marginBottom: 10 },
          this.props.style
        ]}
      />
    );
  }
}
