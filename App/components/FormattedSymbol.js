import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatSymbol } from '../../utils';

export default class FormattedSymbol extends Component {
  render() {
    const { symbol } = this.props;
    return <Text {...this.props}>{formatSymbol(symbol)}</Text>;
  }
}

FormattedSymbol.propTypes = {
  symbol: PropTypes.string.isRequired
};
