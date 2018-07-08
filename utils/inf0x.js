import * as _ from 'lodash';
import { stringify } from 'qs';

export async function getForexPrices(
  symbol,
  quote = 'USD',
  sample = 'DAY',
  n = 7
) {
  const qs = stringify({
    quote,
    symbol,
    sample,
    n
  });
  const response = await fetch(`https://mobidex.io/inf0x/forex/history?${qs}`);
  const json = await response.json();
  // console.debug('Forex Prices', `https://mobidex.io/inf0x/forex/history?${qs}`);
  // console.debug('Forex Prices', json);
  return json;
}

export async function getForexTicker(
  network,
  options = {
    products: [],
    symbols: [],
    quote: 'USD'
  }
) {
  const qs = stringify({
    product: options.products,
    symbol: options.symbols,
    quote: options.quote
  });
  const response = await fetch(
    `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
  );
  const json = await response.json();
  // console.debug(
  //   'Forex Ticker',
  //   `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
  // );
  // console.debug('Forex Ticker', json);
  return json;
}

export async function getTokenPrices(
  network,
  symbol,
  quote = 'WETH',
  sample = 'DAY',
  n = 7
) {
  const qs = stringify({
    quote,
    symbol,
    sample,
    n
  });
  const response = await fetch(
    `https://mobidex.io/inf0x/${network}/token/history?${qs}`
  );
  const json = await response.json();
  // console.debug(
  //   'Token Prices',
  //   `https://mobidex.io/inf0x/${network}/token/history?${qs}`
  // );
  // console.debug('Token Prices', json);
  return json;
}

export async function getTokenTicker(
  network,
  options = {
    products: [],
    symbols: [],
    quote: 'WETH'
  }
) {
  const qs = stringify({
    product: options.products,
    symbol: options.symbols,
    quote: options.quote
  });
  const response = await fetch(
    `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
  );
  const json = await response.json();
  // console.debug(
  //   'Token Ticker',
  //   `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
  // );
  // console.debug('Token Ticker', json);
  return json;
}

export function findTicker(tickers, base, quote) {
  if (base === 'ETH') base = 'WETH';
  if (quote === 'ETH') quote = 'WETH';

  if (!tickers) return null;
  if (!tickers[base]) return null;
  if (!tickers[base][quote]) return null;
  return tickers[base][quote];
}

export function detailsFromTicker(ticker) {
  if (!ticker || !ticker.price) return {};

  const details = {
    price: parseFloat(ticker.price),
    latest: ticker.history.day[0],
    earliest: ticker.history.day[ticker.history.day.length - 1]
  };
  if (!details.latest) {
    details.latestPrice = 0;
    details.earliestPrice = 0;
    details.dayAverage = 0;
    details.changePrice = 0;
    details.changePercent = 0;
  } else {
    details.latestPrice = parseFloat(details.latest.price);
    details.earliestPrice = parseFloat(details.earliest.price);
    details.dayAverage = _.mean(ticker.history.hour.map(({ price }) => price));
    details.changePrice = details.latestPrice - details.earliestPrice;
    details.changePercent = details.changePrice / details.price;
  }
  return details;
}

export function findTickerDetails(tickers, base, quote) {
  return detailsFromTicker(findTicker(tickers, base, quote));
}
