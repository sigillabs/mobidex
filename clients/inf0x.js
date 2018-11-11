import ethUtil from 'ethereumjs-util';
import { stringify } from 'qs';
import UUIDGenerator from 'react-native-uuid-generator';
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
      `${this.endpoint}/${this.network}/tokens/history?${qs}`,
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

export class Inf0xWebSocketClient {
  static async getInf0xWebSocketClient(
    endpoint,
    options = {
      onUpdate: message => {
        console.log(message);
      },
      onError: error => {
        console.error(error);
      },
      onClose: (code, reason) => {
        console.log(code, reason);
      }
    }
  ) {
    const socket = await new Promise((resolve, reject) => {
      const socket = new WebSocket(endpoint);

      socket.onopen = function onOpen() {
        console.info(`Opened inf0x websocket: ${endpoint}`);
        socket.send(JSON.stringify({ type: 'init_req' }));
        resolve(socket);
      };

      socket.onmessage = function onMessage(e) {
        if (options.onUpdate) {
          const data = JSON.parse(e.data);
          if (data && data.payload) {
            options.onUpdate(
              data.channel,
              data.payload.map(({ ticker }) => ticker)
            );
          }
        }
      };

      socket.onerror = function onError(e) {
        if (options.onError) {
          options.onError(new Error(e.message));
        }
      };

      socket.onclose = function onClose(e) {
        if (options.onClose) {
          options.onClose(e.code, e.reason);
        }
      };
    });

    const requestId = await UUIDGenerator.getRandomUUID();

    return new Inf0xWebSocketClient(socket, requestId);
  }

  constructor(socket, requestId) {
    this.socket = socket;
    this.requestId = requestId;
  }

  async subscribeTokenTicker(
    options = {
      makerAssetData: null,
      takerAssetData: null,
      traderAssetData: null
    }
  ) {
    this.socket.send(
      JSON.stringify({
        type: 'subscribe',
        channel: 'token-ticker',
        requestId: this.requestId,
        payload: options
      })
    );
  }

  async subscribeForexTicker(
    options = {
      symbol: null,
      forex: null
    }
  ) {
    this.socket.send(
      JSON.stringify({
        type: 'subscribe',
        channel: 'forex-ticker',
        requestId: this.requestId,
        payload: options
      })
    );
  }
}
