import { assetDataUtils } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../constants/0x';
import * as AssetService from '../../services/AssetService';
import * as WalletService from '../../services/WalletService';
import FormattedTokenAmount from '../components/FormattedTokenAmount';

export default class TokenBalanceByAssetData extends Component {
  static propTypes = {
    assetData: PropTypes.string,
    showSymbol: PropTypes.bool
  };

  static defaultProps = {
    showSymbol: true
  };

  render() {
    const { assetData, showSymbol } = this.props;
    const asset = assetData
      ? AssetService.findAssetByData(assetData)
      : AssetService.getWETHAsset();

    if (!asset) {
      return (
        <FormattedTokenAmount
          {...this.props}
          amount={ZERO}
          symbol={showSymbol ? 'N/A' : undefined}
        />
      );
    }

    const balance = WalletService.getAdjustedBalanceByAddress(
      assetDataUtils.decodeERC20AssetData(asset.assetData).tokenAddress
    );

    return (
      <FormattedTokenAmount
        {...this.props}
        amount={balance}
        symbol={showSymbol ? asset.symbol : undefined}
      />
    );
  }
}
