import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../styles';
import TokenAmount from './TokenAmount';

export default class TouchableTokenAmount extends Component {
  static get propTypes() {
    return {
      onPress: PropTypes.func
    };
  }

  render() {
    const { onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={[styles.p0, styles.m0]}>
        <TokenAmount {...this.props} />
      </TouchableOpacity>
    );
  }
}
