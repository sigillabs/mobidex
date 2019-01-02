import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import * as TickerService from '../../../../services/TickerService';
import { getProfitLossStyle } from '../../../../styles';
import { formatMoney } from '../../../../utils';
import FormattedForexAmount from '../../../components/FormattedForexAmount';
import FormattedPercent from '../../../components/FormattedPercent';
import OrderbookForexPrice from '../../../views/OrderbookForexPrice';
import ForexPriceGraph from '../../../views/ForexPriceGraph';
import ProductDetailsView from './ProductDetailsView';

export default class ForexProductDetailsView extends Component {
  static get propTypes() {
    return {
      base: PropTypes.object,
      quote: PropTypes.object,
      periodIndex: PropTypes.number,
      periods: PropTypes.arrayOf(PropTypes.string).isRequired
    };
  }

  render() {
    const { base, quote, periodIndex, periods } = this.props;
    const ticker = TickerService.getForexTicker(base.symbol);

    if (!ticker) return null;

    const period = periods[periodIndex].toLowerCase();
    const average = TickerService.get24HRAverage(ticker);
    const change = TickerService.get24HRChange(ticker);
    const changePercent = TickerService.get24HRChangePercent(ticker);
    const max = TickerService.get24HRMax(ticker);
    const min = TickerService.get24HRMin(ticker);
    const infolist = [
      {
        key: 'bid',
        left: 'Highest Bid',
        right: (
          <OrderbookForexPrice
            quoteAssetData={quote.assetData}
            baseAssetData={base.assetData}
            default={0}
            side={'buy'}
          />
        )
      },
      {
        key: 'ask',
        left: 'Lowest Ask',
        right: (
          <OrderbookForexPrice
            quoteAssetData={quote.assetData}
            baseAssetData={base.assetData}
            default={0}
            side={'sell'}
          />
        )
      },
      {
        key: '24hrprice',
        left: '24 Hour Price Average',
        right: <FormattedForexAmount amount={average} />
      },
      {
        key: '24hrpricechange',
        left: '24 Hour Price Change',
        right: (
          <Text>
            <FormattedForexAmount amount={change} />
            <Text> </Text>
            <Text>(</Text>
            <FormattedPercent percent={changePercent} />
            <Text>)</Text>
          </Text>
        ),
        rightStyle: getProfitLossStyle(changePercent)
      },
      {
        key: '24hrmax',
        left: '24 Hour Max',
        right: <FormattedForexAmount amount={max} />
      },
      {
        key: '24hrmin',
        left: '24 Hour Min',
        right: <FormattedForexAmount amount={min} />
      }
    ];
    const graph = (
      <ForexPriceGraph baseSymbol={base.symbol} quoteSymbol={quote.symbol} />
    );

    return (
      <ProductDetailsView
        base={base}
        quote={quote}
        period={period}
        infolist={infolist}
        formatAmount={v => formatMoney(v)}
        graph={graph}
      />
    );
  }
}
