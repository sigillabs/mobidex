import {ContractDefinitionLoader} from 'web3-contracts-loader';
import {time} from '../lib/decorators/cls';
import {bigIntToEthHex} from '../lib/utils';

const Weth9ABI = require('../abi/WETH9.json');

let CONTRACT = null;

export default class EtherToken {
  constructor(ethereumClient, address) {
    this.ethereumClient = ethereumClient;
    this.address = address;
  }

  @time
  async getContract() {
    if (!CONTRACT) {
      const networkId = await this.ethereumClient.getNetworkId();
      const account = await this.ethereumClient.getAccount();
      CONTRACT = ContractDefinitionLoader({
        web3: this.ethereumClient.getWeb3(),
        contractDefinitions: {
          WETH9: {
            ...Weth9ABI,
            networks: {
              [networkId]: {
                address: this.address,
              },
            },
          },
        },
        options: {
          from: account,
        },
      }).WETH9;
    }

    return CONTRACT;
  }

  @time
  async balanceOf(account) {
    const contract = await this.getContract();
    const amount = await contact.methods.balanceOf(account);
    return result;
  }

  @time
  async withdraw(wad) {
    const contract = await this.getContract();
    const result = contract.methods.withdraw(bigIntToEthHex(wad)).send();
    return result;
  }
}
