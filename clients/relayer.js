import { HttpClient } from '@0xproject/connect';
import { cache, time } from '../decorators/cls';

export default class RelayerClient {
  constructor(relayerEndpoint, options = { network: null }) {
    this.relayerEndpoint = relayerEndpoint;
    this.network = (options || {}).network;
    this.client = new HttpClient(this.relayerEndpoint);
  }

  @time
  @cache('relayer:v2:pairs', 24 * 60 * 60)
  async getAssetPairs() {
    const result = await this.client.getAssetPairsAsync({
      networkId: this.network,
      perPage: 1000
    });
    return result.records;
  }

  @time
  @cache('relayer:v2:orders', 1)
  async getOrders() {
    const result = await this.client.getOrdersAsync({
      networkId: this.network,
      perPage: 1000
    });
    return result.records.map(record => record.order);
  }

  @time
  async getOrder(hash) {
    const record = await this.client.getOrderAsync(hash, {
      networkId: this.network
    });
    if (record) {
      return record.order;
    } else {
      return null;
    }
  }

  @time
  @cache('relayer:v2:orderbook:{}:{}:{}', 1)
  async getOrderbook(baseAssetData, quoteAssetData) {
    const result = await this.client.getOrderbookAsync(
      {
        baseAssetData,
        quoteAssetData
      },
      {
        networkId: this.network,
        perPage: 1000
      }
    );
    return {
      asks: result.asks.records.map(record => record.order),
      bids: result.bids.records.map(record => record.order)
    };
  }

  @time
  async submitOrder(order) {
    return this.client.submitOrderAsync(order, {
      networkId: this.network
    });
  }
}
