import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

export default class Row extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <View {...rest} style={[styles.row, style]}>
        {this.props.children}
      </View>
    );
  }
}
