import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { formatMoney } from '../../lib/utils';

export default class FormattedForexAmount extends Component {
  static get propTypes() {
    return {
      amount: PropTypes.oneOfType([
        PropTypes.instanceOf(BigNumber),
        PropTypes.number,
        PropTypes.string
      ]).isRequired
    };
  }

  render() {
    const { amount, ...rest } = this.props;

    return <Text {...rest}>{formatMoney(amount)}</Text>;
  }
}
