import {BigNumber, formatFixedDecimals} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import {BigNumberProp} from '../../types/props';

export default class TokenAmount extends React.PureComponent {
  static get propTypes() {
    return {
      address: PropTypes.string.isRequired,
      amount: BigNumberProp.isRequired,
    };
  }

  render() {
    const {address, amount, ...rest} = this.props;
    const {decimals} = AssetService.findAssetByAddress(address);
    const formattedAmount = formatFixedDecimals(amount.toString(), decimals, {
      decimalPlaces: Math.floor(decimals / 3),
    });

    return <Text {...rest}>{formattedAmount}</Text>;
  }
}
