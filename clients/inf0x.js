import ethUtil from 'ethereumjs-util';
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

    const response = await fetch(`${this.endpoint}/forex/history?${qs}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
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
      `${this.endpoint}/${this.network}/forex/ticker?${qs}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
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
      `${this.endpoint}/${this.network}/token/history?${qs}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
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
      `${this.endpoint}/${this.network}/tokens/ticker?${qs}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    const json = await response.json();

    // console.debug(
    //   'Token Ticker',
    //   `${this.endpoint}/${this.network}/tokens/ticker?${qs}`
    // );
    // console.debug('Token Ticker', json);
    return json;
  }

  @time
  @cache('inf0x:v2:events:all', 5)
  async getEvents(account) {
    const qs = stringify({
      account: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    });

    const response = await fetch(
      `${this.endpoint}/${this.network}/events?${qs}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
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
