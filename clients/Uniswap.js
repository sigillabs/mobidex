import {ContractDefinitionLoader} from 'web3-contracts-loader';
import {time} from '../lib/decorators/cls';

const FactoryABI = require('../abi/uniswap/Factory.json');
const ExchangeABI = require('../abi/uniswap/Exchange.json');

export default class UniswapClient {
  constructor(ethereumClient, address) {
    this.ethereumClient = ethereumClient;
    this.address = address;
  }

  @time
  async getContract(name, abi, address) {
    const networkId = await this.ethereumClient.getNetworkId();
    const account = await this.ethereumClient.getAccount();
    return ContractDefinitionLoader({
      web3: this.ethereumClient.getWeb3(),
      contractDefinitions: {
        [name]: {
          ...abi,
          networks: {
            [networkId]: {
              address,
            },
          },
        },
      },
      options: {
        from: account,
      },
    })[name];
  }

  @time
  async getFactoryContract() {
    return this.getContract('Factory', FactoryABI, this.address);
  }

  @time
  async getExchangeContract(address) {
    return this.getContract('Exchange', ExchangeABI, address);
  }
}
