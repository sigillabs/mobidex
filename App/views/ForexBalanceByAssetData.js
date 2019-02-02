import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ZERO } from '../../constants/0x';
import * as AssetService from '../../services/AssetService';
import * as TickerService from '../../services/TickerService';
import * as WalletService from '../../services/WalletService';
import FormattedForexAmount from '../components/FormattedForexAmount';

export default class ForexBalanceByAssetData extends Component {
  static propTypes = {
    assetData: PropTypes.string
  };

  static defaultProps = {
    showSymbol: true
  };

  render() {
    const { assetData } = this.props;
    const asset = assetData
      ? AssetService.findAssetByData(assetData)
      : AssetService.getWETHAsset();

    if (!asset) {
      return <FormattedForexAmount {...this.props} amount={ZERO} />;
    }

    const balance = WalletService.getBalanceByAssetData(this.props.assetData);
    const price = TickerService.getCurrentPrice(
      TickerService.getForexTicker(asset.symbol)
    );
    const forexBalance = balance.mul(price);

    return <FormattedForexAmount {...this.props} amount={forexBalance} />;
  }
}
