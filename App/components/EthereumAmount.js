import {BigNumber, formatFixedDecimals} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import {BigNumberProp} from '../../types/props';

export default class EthereumAmount extends React.PureComponent {
  static get propTypes() {
    return {
      amount: BigNumberProp.isRequired,
      unit: PropTypes.string.isRequired,
      decimalPlaces: PropTypes.number.isRequired,
    };
  }

  static get defaultProps() {
    return {
      unit: 'ether',
      decimalPlaces: 6,
    };
  }

  render() {
    const {unit, decimalPlaces, amount, ...rest} = this.props;
    let decimals = 18;
    switch (unit) {
      case 'wei':
        decimals = 0;
        break;

      case 'gwei':
        decimals = 9;
        break;
    }
    const formattedAmount = formatFixedDecimals(amount, decimals, {
      decimalPlaces,
    });

    return <Text {...rest}>{formattedAmount}</Text>;
  }
}
