import React, { Component } from 'react';
import { Text as RNEText } from 'react-native-elements';

export default class Text extends Component {
  render() {
    let { children, ...rest } = this.props;
    let _children = ['\u2066'];
    if (Array.isArray(children)) {
      _children = _children.concat(children);
    } else {
      _children.push(children);
    }
    return <RNEText {...rest}>{_children}</RNEText>;
  }
}
