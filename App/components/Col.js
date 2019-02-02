import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';
import { styleProp } from '../../types/props';

export default class Col extends Component {
  static get propTypes() {
    return {
      style: styleProp,
      right: PropTypes.bool.isRequired,
      size: PropTypes.number.isRequired
    };
  }

  static get defaultProps() {
    return {
      size: 1,
      right: false
    };
  }

  render() {
    let { right, style, ...rest } = this.props;
    return (
      <View
        {...rest}
        style={[
          styles.col,
          style,
          right ? { alignItems: 'flex-end' } : null,
          {
            flex: this.props.size
          }
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}
