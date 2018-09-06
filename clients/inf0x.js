import { stringify } from 'qs';
import { cache, time } from '../decorators/cls';

export default class Inf0xClient {
  constructor(endpoint, options = { network: null }) {
    this.endpoint = endpoint;
    this.network = options.network;
  }

  @time
  @cache('inf0x:v2:forex:prices:{}:{}:{}:{}', 5)
  async getForexPrices(symbol, quote = 'USD', sample = 'DAY', n = 7) {
    const qs = stringify({
      quote,
      symbol,
      sample,
      n
    });

    const response = await fetch(`${this.endpoint}/forex/history?${qs}`);
    const json = await response.json();

    // console.debug('Forex Prices', `${this.endpoint}/forex/history?${qs}`);
    // console.debug('Forex Prices', json);
    return json;
  }

  @time
  @cache('inf0x:v2:forex:ticker:{}:{}:{}', 5)
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
    //   `${this.endpoint}/${this.network}/forex/ticker?${qs}`
    // );
    // console.debug('Forex Ticker', json);
    return json;
  }

  @time
  @cache('inf0x:v2:token:prices:{}:{}:{}:{}', 5)
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
    //   `${this.endpoint}/${this.network}/token/history?${qs}`
    // );
    // console.debug('Token Prices', json);
    return json;
  }

  @time
  @cache('inf0x:v2:token:ticker:{}:{}:{}', 5)
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
    //   `${this.endpoint}/${this.network}/tokens/ticker?${qs}`
    // );
    // console.debug('Token Ticker', json);
    return json;
  }
}
