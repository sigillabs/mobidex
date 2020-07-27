import {BigNumber} from '@uniswap/sdk';
import {ContractDefinitionLoader} from 'web3-contracts-loader';
import {MAX_UINT256_HEX, ZERO} from '../constants';
import {cache, time} from '../lib/decorators/cls';
import {
  bigIntToEthHex,
  formatHexString,
  hex2a,
  toBaseUnitAmount,
  toUnitAmount,
} from '../lib/utils';

const TokenABI = require('../abi/Token.json');
const BytesTokenABI = require('../abi/BytesToken.json');

// TODO: Replace
export default class TokenClient {
  constructor(ethereumClient, address) {
    this.ethereumClient = ethereumClient;
    this.address = address;
  }

  @time
  async getContract() {
    const networkId = await this.ethereumClient.getNetworkId();
    const account = await this.ethereumClient.getAccount();
    return ContractDefinitionLoader({
      web3: this.ethereumClient.getWeb3(),
      contractDefinitions: {
        Token: {
          ...TokenABI,
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
    }).Token;
  }

  @time
  @cache(function () {
    return 'client:token:' + this.address;
  }, 365 * 24 * 60 * 60)
  async get() {
    const networkId = await this.ethereumClient.getNetworkId();
    const account = await this.ethereumClient.getAccount();
    const contract = ContractDefinitionLoader({
      web3: this.ethereumClient.getWeb3(),
      contractDefinitions: {
        Token: {
          ...TokenABI,
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
    }).Token;
    const bytesContract = ContractDefinitionLoader({
      web3: this.ethereumClient.getWeb3(),
      contractDefinitions: {
        Token: {
          ...BytesTokenABI,
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
    }).Token;

    let name = null;
    let symbol = null;
    let decimals = null;

    try {
      decimals = await contract.methods.decimals().call();
      decimals = parseInt(decimals);
    } catch (err) {
      console.warn('MOBIDEX: ', 'Could not fetch decimals', err);
    }

    try {
      name = await contract.methods.name().call();
    } catch (err) {
      console.warn('MOBIDEX: ', 'Could not fetch name', err);
    }

    if (!name) {
      try {
        name = await bytesContract.methods.name().call();
        name = hex2a(name).trim().substring(1);
      } catch (err) {
        console.warn('MOBIDEX: ', 'Could not fetch name again', err);
      }
    }

    if (!name) {
      return null;
    }

    try {
      symbol = await contract.methods.symbol().call();
    } catch (err) {
      console.warn('MOBIDEX: ', 'Could not fetch symbol', err);
    }

    if (!symbol) {
      try {
        symbol = await bytesContract.methods.symbol().call();
        symbol = hex2a(symbol).trim().substring(1);
      } catch (err) {
        console.warn('MOBIDEX: ', 'Could not fetch symbol', err);
      }
    }

    if (!symbol) {
      return null;
    }

    let token = {address: this.address, name, symbol, decimals};

    if (!token.name || !token.symbol || !token.decimals) {
      return null;
    }

    return token;
  }

  @time
  async getBalance() {
    const contract = await this.getContract();
    const account = await this.ethereumClient.getAccount();
    const balance = await contract.methods.balanceOf(account).call();
    return new BigNumber(balance.toString());
  }

  @time
  async getAllowance(spender) {
    const contract = await this.getContract();
    const account = await this.ethereumClient.getAccount();
    const allowance = await contract.methods.allowance(account, spender).call();
    return new BigNumber(allowance.toString());
  }

  @time
  async unlock(spender) {
    const contract = await this.getContract();
    const result = await contract.methods
      .approve(spender, MAX_UINT256_HEX)
      .send();
    return result;
  }

  @time
  async send(to, amount) {
    const contract = await this.getContract();
    const result = await contract.methods
      .transfer(formatHexString(to), bigIntToEthHex(amount))
      .send();
    return result;
  }
}
