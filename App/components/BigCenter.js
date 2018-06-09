import React, { Component } from 'react';
import { View } from 'react-native';

export default class BigCenter extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <View
        {...rest}
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingRight: 10,
            paddingBottom: 10,
            paddingLeft: 10
          },
          style
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}
