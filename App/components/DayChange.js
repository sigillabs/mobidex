import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as AssetService from '../../services/AssetService';
import * as TickerService from '../../services/TickerService';
import FormattedPercent from '../components/FormattedPercent';

export default class DayChange extends Component {
  static get propTypes() {
    return {
      quoteAssetData: PropTypes.string.isRequired,
      baseAssetData: PropTypes.string.isRequired
    };
  }

  render() {
    const { baseAssetData, quoteAssetData } = this.props;
    const base = AssetService.findAssetByData(baseAssetData);
    const quote = AssetService.findAssetByData(quoteAssetData);
    const tokenTicker = TickerService.getQuoteTicker(base.symbol, quote.symbol);

    if (!tokenTicker) {
      return <FormattedPercent {...this.props} percent={0} />;
    }

    const change = TickerService.get24HRChangePercent(tokenTicker).toNumber();

    return <FormattedPercent {...this.props} percent={change} />;
  }
}
