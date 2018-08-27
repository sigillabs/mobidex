import { stringify } from 'qs';
import { fetchWithTiming } from '../utils/timing';

export default class Inf0xClient {
  constructor(baseUrl, options = { network: null }) {
    this.baseUrl = baseUrl;
    this.network = options.network;
  }

  async getForexPrices(symbol, quote = 'USD', sample = 'DAY', n = 7) {
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

  async getForexTicker(products = [], symbols = [], quote = 'USD') {
    const qs = stringify({
      product: products,
      symbol: symbols,
      quote
    });

    const json = fetchWithTiming(
      'Forex Ticker',
      `https://mobidex.io/inf0x/${this.network}/forex/ticker?${qs}`
    );

    // console.debug(
    //   'Forex Ticker',
    //   `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
    // );
    // console.debug('Forex Ticker', json);
    return json;
  }

  async getTokenPrices(symbol, quote = 'WETH', sample = 'DAY', n = 7) {
    const qs = stringify({
      quote,
      symbol,
      sample,
      n
    });
    const json = fetchWithTiming(
      'Token Prices',
      `https://mobidex.io/inf0x/${this.network}/token/history?${qs}`
    );

    // console.debug(
    //   'Token Prices',
    //   `https://mobidex.io/inf0x/${network}/token/history?${qs}`
    // );
    // console.debug('Token Prices', json);
    return json;
  }

  async getTokenTicker(products = [], symbols = [], quote = 'WETH') {
    const qs = stringify({
      product: products,
      symbol: symbols,
      quote
    });
    const json = fetchWithTiming(
      'Token Ticker',
      `https://mobidex.io/inf0x/${this.network}/tokens/ticker?${qs}`
    );
    // console.debug(
    //   'Token Ticker',
    //   `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
    // );
    // console.debug('Token Ticker', json);
    return json;
  }
}
