import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import * as styles from '../../styles';
import { styleProp } from '../../types/props';

export default class SmallText extends Component {
  render() {
    let { style, ...rest } = this.props;
    return (
      <Text {...rest} style={[styles.small, style]}>
        {this.props.children}
      </Text>
    );
  }
}

SmallText.propTypes = {
  style: styleProp,
  children: PropTypes.any
};
