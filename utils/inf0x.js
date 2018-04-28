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
  return await response.json();
}

export async function getForexTicker(network, symbols = [], quote = 'USD') {
  const qs = stringify({
    symbol: symbols,
    quote
  });
  const response = await fetch(
    `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
  );
  return await response.json();
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
  return await response.json();
}

export async function getTokenTicker(network, symbols = [], quote = 'WETH') {
  const qs = stringify({
    symbol: symbols,
    quote
  });
  const response = await fetch(
    `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
  );
  return await response.json();
}

export function detailsFromTicker(ticker) {
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
