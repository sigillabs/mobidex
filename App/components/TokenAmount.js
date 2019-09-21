import {BigNumber, formatFixedDecimals} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native-elements';
import {ZERO} from '../../constants';
import * as AssetService from '../../services/AssetService';
import {addressProp, BigNumberProp} from '../../types/props';

export default class TokenAmount extends React.PureComponent {
  static get propTypes() {
    return {
      address: addressProp,
      amount: BigNumberProp,
    };
  }

  render() {
    const {address, amount, ...rest} = this.props;
    const {decimals} = AssetService.findAssetByAddress(address);
    const formattedAmount = formatFixedDecimals(amount || ZERO, decimals, {
      decimalPlaces: Math.floor(decimals / 3),
    });

    return <Text {...rest}>{formattedAmount}</Text>;
  }
}
