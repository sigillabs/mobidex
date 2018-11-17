import React, { Component } from 'react';
import { View } from 'react-native';

export default class FullScreen extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <View
        {...rest}
        style={[
          {
            flex: 1,
            width: '100%',
            height: '100%'
          },
          style
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}
