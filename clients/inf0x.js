import { stringify } from 'qs';
import { cache, time } from '../decorators/cls';

export default class Inf0xClient {
  constructor(endpoint, options = { network: null }) {
    this.endpoint = endpoint;
    this.network = options.network;
  }

  @time
  @cache('inf0x:forex:prices:{}:{}:{}:{}', 5 * 1000)
  async getForexPrices(symbol, quote = 'USD', sample = 'DAY', n = 7) {
    const qs = stringify({
      quote,
      symbol,
      sample,
      n
    });

    const response = await fetch(`${this.endpoint}?${qs}`);
    const json = await response.json();

    // console.debug('Forex Prices', `https://mobidex.io/inf0x/forex/history?${qs}`);
    // console.debug('Forex Prices', json);
    return json;
  }

  @time
  @cache('inf0x:forex:prices:{}:{}:{}', 5 * 1000)
  async getForexTicker(products = [], symbols = [], quote = 'USD') {
    const qs = stringify({
      product: products,
      symbol: symbols,
      quote
    });

    const response = await fetch(
      `${this.endpoint}/${this.network}/forex/ticker?${qs}`
    );
    const json = await response.json();

    // console.debug(
    //   'Forex Ticker',
    //   `https://mobidex.io/inf0x/${network}/forex/ticker?${qs}`
    // );
    // console.debug('Forex Ticker', json);
    return json;
  }

  @time
  @cache('inf0x:forex:prices:{}:{}:{}:{}', 5 * 1000)
  async getTokenPrices(symbol, quote = 'WETH', sample = 'DAY', n = 7) {
    const qs = stringify({
      quote,
      symbol,
      sample,
      n
    });

    const response = await fetch(
      `${this.endpoint}/${this.network}/token/history?${qs}`
    );
    const json = await response.json();

    // console.debug(
    //   'Token Prices',
    //   `https://mobidex.io/inf0x/${network}/token/history?${qs}`
    // );
    // console.debug('Token Prices', json);
    return json;
  }

  @time
  @cache('inf0x:forex:prices:{}:{}:{}', 5 * 1000)
  async getTokenTicker(products = [], symbols = [], quote = 'WETH') {
    const qs = stringify({
      product: products,
      symbol: symbols,
      quote
    });

    const response = await fetch(
      `${this.endpoint}/${this.network}/tokens/ticker?${qs}`
    );
    const json = await response.json();

    // console.debug(
    //   'Token Ticker',
    //   `https://mobidex.io/inf0x/${network}/tokens/ticker?${qs}`
    // );
    // console.debug('Token Ticker', json);
    return json;
  }
}
