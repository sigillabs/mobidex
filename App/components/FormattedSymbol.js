import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatSymbol } from '../../utils';

export default class FormattedSymbol extends Component {
  static get propTypes() {
    return {
      symbol: PropTypes.string.isRequired
    };
  }

  render() {
    const { symbol, ...rest } = this.props;
    return <Text {...rest}>{formatSymbol(symbol)}</Text>;
  }
}
