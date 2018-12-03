import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../styles';
import TokenAmount from './TokenAmount';

export default class TouchableTokenAmount extends Component {
  static get propTypes() {
    return {
      wrapperStyle: PropTypes.object,
      onPress: PropTypes.func
    };
  }

  render() {
    const { onPress, wrapperStyle } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={[styles.p0, styles.m0, wrapperStyle]}>
        <TokenAmount {...this.props} />
      </TouchableOpacity>
    );
  }
}
