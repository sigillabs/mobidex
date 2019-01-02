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
    showSymbol: PropTypes.bool,
    adjusted: PropTypes.bool
  };

  static defaultProps = {
    showSymbol: true,
    adjusted: true
  };

  render() {
    const { adjusted, assetData, showSymbol } = this.props;
    const asset = assetData
      ? AssetService.findAssetByData(assetData)
      : AssetService.getWETHAsset();

    if (!asset) {
      return (
        <FormattedTokenAmount
          {...this.props}
          amount={ZERO}
          assetData={null}
          showSymbol={false}
        />
      );
    }

    const { tokenAddress } = assetDataUtils.decodeERC20AssetData(
      asset.assetData
    );
    const balance = adjusted
      ? WalletService.getAdjustedBalanceByAddress(tokenAddress)
      : WalletService.getBalanceByAddress(tokenAddress);

    return (
      <FormattedTokenAmount
        {...this.props}
        amount={balance}
        assetData={assetData}
        showSymbol={showSymbol}
      />
    );
  }
}
