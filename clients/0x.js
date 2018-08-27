import { ZeroEx } from '0x.js';
import { cache, time } from '../decorators/cls';

const TokenABI = require('../abi/Token.json');
const BytesTokenABI = require('../abi/BytesToken.json');

export default class ZeroExClient {
  constructor(ethereumClient) {
    this.ethereumClient = ethereumClient;
  }

  @time
  async getZeroExClient() {
    return new ZeroEx(this.ethereumClient.getCurrentProvider(), {
      networkId: await this.ethereumClient.getNetworkId()
    });
  }

  @time
  @cache('0x:exchange-contract', 1000)
  async getZeroExContractAddress() {
    const zeroEx = await this.getZeroExClient();
    return await zeroEx.exchange.getContractAddress();
  }

  @time
  @cache('0x:tokens', 1000)
  async getZeroExTokens() {
    const zeroEx = await this.getZeroExClient();
    return await zeroEx.tokenRegistry.getTokensAsync();
  }
}
