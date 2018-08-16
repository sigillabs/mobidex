import { stringify } from 'qs';
import { fetchWithTiming } from './timing';

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

  const json = fetchWithTiming(
    'Forex Prices',
    `https://mobidex.io/inf0x/forex/history?${qs}`
  );

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

  const json = fetchWithTiming(
    'Forex Ticker',
    `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
  );

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
  const json = fetchWithTiming(
    'Token Prices',
    `https://mobidex.io/inf0x/${network}/token/history?${qs}`
  );

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
  const json = fetchWithTiming(
    'Token Ticker',
    `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
  );
  // console.debug(
  //   'Token Ticker',
  //   `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
  // );
  // console.debug('Token Ticker', json);
  return json;
}
