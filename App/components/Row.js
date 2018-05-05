import React, { Component } from 'react';
import { View } from 'react-native';

export default class Row extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <View
        {...rest}
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          style
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}
