import { HttpClient } from '@0xproject/connect';
import { cache, time } from '../lib/decorators/cls';

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
  @cache('relayer:v2:orders', 24 * 60 * 60)
  async getOrders() {
    const result = await this.client.getOrdersAsync({
      networkId: this.network,
      perPage: 1000
    });
    return result.records.map(record => record.order);
  }

  @time
  // @cache('relayer:v2:orders:{}', 24 * 60 * 60)
  async getOrdersForAddress(address) {
    const result = await this.client.getOrdersAsync({
      networkId: this.network,
      perPage: 1000,
      makerAddress: address
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
  // @cache('relayer:v2:orderbook:{}:{}:{}:{}', 1)
  async getOrderbook(baseAssetData, quoteAssetData, page = 1, perPage = 1000) {
    const result = await this.client.getOrderbookAsync(
      {
        baseAssetData,
        quoteAssetData
      },
      {
        networkId: this.network,
        perPage,
        page
      }
    );
    return {
      asks: result.asks.records.map(record => record.order),
      bids: result.bids.records.map(record => record.order)
    };
  }

  @time
  async getOrderConfig(order) {
    return this.client.getOrderConfigAsync(order, {
      networkId: this.network
    });
  }

  @time
  async submitOrder(order) {
    return this.client.submitOrderAsync(order, {
      networkId: this.network
    });
  }
}
