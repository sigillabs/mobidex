import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import BigCenter from '../components/BigCenter';

export default class EmptyList extends Component {
  render() {
    let {containerStyle, wrapperStyle} = this.props;
    return (
      <BigCenter style={[{height: '100%'}, containerStyle]}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            },
            wrapperStyle,
          ]}
          onPress={this.props.onPress}>
          {this.props.children}
        </TouchableOpacity>
      </BigCenter>
    );
  }
}
