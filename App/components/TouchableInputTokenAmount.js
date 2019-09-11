import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../styles';
import { styleProp } from '../../types/props';
import InputTokenAmount from './InputTokenAmount';

export default class TouchableInputTokenAmount extends Component {
  static get propTypes() {
    return {
      wrapperStyle: styleProp,
      onPress: PropTypes.func
    };
  }

  render() {
    const { onPress, wrapperStyle } = this.props;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.p0, styles.m0, wrapperStyle]}
      >
        <InputTokenAmount {...this.props} />
      </TouchableOpacity>
    );
  }
}
