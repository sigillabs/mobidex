import { HttpClient } from '@0xproject/connect';
import { cache, time } from '../decorators/cls';

export default class RelayerClient {
  constructor(relayerEndpoint, options = { network: null }) {
    this.relayerEndpoint = relayerEndpoint;
    this.client = new HttpClient(this.relayerEndpoint);
  }

  @time
  @cache('relayer:pairs', 60)
  async getTokenPairs() {
    return await this.client.getTokenPairsAsync();
  }

  @time
  @cache('relayer:orders', 1)
  async getOrders() {
    return await this.client.getOrdersAsync();
  }

  @time
  async getOrder(hash) {
    return await this.client.getOrderAsync(hash);
  }

  @time
  @cache('relayer:orderbook:{}:{}', 1)
  async getOrderbook(baseTokenAddress, quoteTokenAddress) {
    return await this.client.getOrderbookAsync({
      baseTokenAddress,
      quoteTokenAddress
    });
  }
}
