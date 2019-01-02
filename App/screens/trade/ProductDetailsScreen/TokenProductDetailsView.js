import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { getProfitLossStyle } from '../../../../styles';
import { formatAmount } from '../../../../utils';
import FormattedPercent from '../../../components/FormattedPercent';
import FormattedTokenAmount from '../../../components/FormattedTokenAmount';
import * as TickerService from '../../../../services/TickerService';
import OrderbookPrice from '../../../views/OrderbookPrice';
import TokenPriceGraph from '../../../views/TokenPriceGraph';
import ProductDetailsView from './ProductDetailsView';

export default class TokenProductDetailsView extends Component {
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
    const ticker = TickerService.getQuoteTicker(base.symbol, quote.symbol);

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
          <OrderbookPrice
            quoteAssetData={quote.assetData}
            baseAssetData={base.assetData}
            default={0}
            side={'sell'}
            symbol={quote.symbol}
          />
        )
      },
      {
        key: 'ask',
        left: 'Lowest Ask',
        right: (
          <OrderbookPrice
            quoteAssetData={quote.assetData}
            baseAssetData={base.assetData}
            default={0}
            side={'buy'}
            symbol={quote.symbol}
          />
        )
      },
      {
        key: '24hrprice',
        left: '24 Hour Price Average',
        right: (
          <FormattedTokenAmount amount={average} assetData={quote.assetData} />
        )
      },
      {
        key: '24hrpricechange',
        left: '24 Hour Price Change',
        right: (
          <Text>
            <FormattedTokenAmount amount={change} assetData={quote.assetData} />
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
        right: <FormattedTokenAmount amount={max} assetData={quote.assetData} />
      },
      {
        key: '24hrmin',
        left: '24 Hour Min',
        right: <FormattedTokenAmount amount={min} assetData={quote.assetData} />
      }
    ];
    const graph = (
      <TokenPriceGraph baseSymbol={base.symbol} quoteSymbol={quote.symbol} />
    );

    return (
      <ProductDetailsView
        base={base}
        quote={quote}
        period={period}
        infolist={infolist}
        formatAmount={v => `${formatAmount(v)} ${quote.symbol}`}
        graph={graph}
      />
    );
  }
}
