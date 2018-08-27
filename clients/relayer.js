import { HttpClient } from '@0xproject/connect';
import { cache, time } from '../decorators/cls';

export default class RelayerClient {
  constructor(relayerEndpoint, options = { network: null }) {
    this.relayerEndpoint = relayerEndpoint;
    this.client = new HttpClient(this.relayerEndpoint);
  }

  @time
  @cache('relayer:pairs', 60 * 1000)
  async getTokenPairs() {
    return await this.client.getTokenPairsAsync();
  }

  @time
  async getOrders() {
    return await this.client.getOrdersAsync();
  }

  @time
  async getOrder(hash) {
    return await this.client.getOrderAsync(hash);
  }
}
