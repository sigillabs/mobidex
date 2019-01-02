import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native-elements';
import * as AssetService from '../../services/AssetService';
import { formatAmount, formatAmountWithDecimals } from '../../utils';
import FormattedSymbol from './FormattedSymbol';

export default class FormattedTokenAmount extends React.PureComponent {
  static get propTypes() {
    return {
      assetData: PropTypes.string,
      amount: PropTypes.oneOfType([
        PropTypes.instanceOf(BigNumber),
        PropTypes.number,
        PropTypes.string
      ]).isRequired,
      children: PropTypes.node,
      isUnitAmount: PropTypes.bool.isRequired,
      showSymbol: PropTypes.bool.isRequired,
      symbol: PropTypes.string
    };
  }

  static get defaultProps() {
    return {
      isUnitAmount: true,
      showSymbol: true
    };
  }

  render() {
    const {
      amount,
      assetData,
      children,
      isUnitAmount,
      showSymbol,
      symbol,
      ...rest
    } = this.props;
    const asset = AssetService.findAssetByData(assetData || null);

    return (
      <Text {...rest}>
        <Text>
          {isUnitAmount
            ? formatAmount(amount)
            : formatAmountWithDecimals(amount, asset.decimals)}
        </Text>
        {showSymbol ? <Text> </Text> : null}
        {showSymbol ? (
          <FormattedSymbol symbol={symbol || asset.symbol} />
        ) : null}
        {React.Children.count(children || []) > 0 ? <Text> </Text> : null}
        {React.Children.count(children || []) > 0 ? children : null}
      </Text>
    );
  }
}
