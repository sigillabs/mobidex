import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

export default class FullScreen extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <View {...rest} style={[styles.flex1, styles.w100, styles.h100, style]}>
        {this.props.children}
      </View>
    );
  }
}
