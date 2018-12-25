import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { fonts, styles } from '../../styles';

export default class MajorText extends Component {
  static get propTypes() {
    return {
      children: PropTypes.node.isRequired
    };
  }

  render() {
    return (
      <Text
        style={[styles.normal, fonts.xlarge, styles.pb2, styles.textCenter]}
      >
        {this.props.children}
      </Text>
    );
  }
}
