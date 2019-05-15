import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../constants/0x';
import * as AssetService from '../../services/AssetService';
import { WalletService } from '../../services/WalletService';
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
    const asset = AssetService.findAssetByData(assetData);

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

    const balance = WalletService.instance.getBalanceByAssetData(
      asset.assetData
    );

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
