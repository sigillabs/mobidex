import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import ethUtil from 'ethereumjs-util';
import { ContractDefinitionLoader } from 'web3-contracts-loader';
import { ZERO } from '../constants/0x';
import { cache, time } from '../decorators/cls';
import { hex2a } from '../utils';
import ZeroExClient from './0x.js';

const TokenABI = require('../abi/Token.json');
const BytesTokenABI = require('../abi/BytesToken.json');

export default class TokenClient {
  constructor(ethereumClient, address) {
    this.ethereumClient = ethereumClient;
    this.address = address;
  }

  @time
  @cache(function() {
    return 'client:token:' + this.address;
  }, 24 * 60 * 60)
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
              address: this.address
            }
          }
        }
      },
      options: {
        from: account
      }
    }).Token;
    const bytesContract = ContractDefinitionLoader({
      web3: this.ethereumClient.getWeb3(),
      contractDefinitions: {
        Token: {
          ...BytesTokenABI,
          networks: {
            [networkId]: {
              address: this.address
            }
          }
        }
      },
      options: {
        from: account
      }
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
        name = hex2a(name)
          .trim()
          .substring(1);
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
        symbol = hex2a(symbol)
          .trim()
          .substring(1);
      } catch (err) {
        console.warn('MOBIDEX: ', 'Could not fetch symbol', err);
      }
    }

    if (!symbol) {
      return null;
    }

    let token = { address: this.address, name, symbol, decimals };

    if (!token.name || !token.symbol || !token.decimals) {
      return null;
    }

    return token;
  }

  @time
  @cache(function() {
    return 'client:token:' + this.address + ':balance';
  }, 60)
  async getBalance() {
    const contractWrappers = await new ZeroExClient(
      this.ethereumClient
    ).getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const balance = await contractWrappers.erc20Token.getBalanceAsync(
      `0x${ethUtil.stripHexPrefix(this.address.toString().toLowerCase())}`,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
    return balance;
  }

  @time
  @cache(function() {
    return 'client:token:' + this.address + ':allowance';
  }, 60)
  async getAllowance(account = null) {
    const contractWrappers = await new ZeroExClient(
      this.ethereumClient
    ).getContractWrappers();

    if (account == null) {
      account = await this.ethereumClient.getAccount();
    }

    return await contractWrappers.erc20Token.getProxyAllowanceAsync(
      `0x${ethUtil.stripHexPrefix(this.address.toString())}`,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async setUnlimitedProxyAllowance(account = null) {
    const contractWrappers = await new ZeroExClient(
      this.ethereumClient
    ).getContractWrappers();

    if (account == null) {
      account = await this.ethereumClient.getAccount();
    }

    return await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      `0x${ethUtil.stripHexPrefix(this.address.toString().toLowerCase())}`,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async setProxyAllowance(account = null, amount = ZERO) {
    const contractWrappers = await new ZeroExClient(
      this.ethereumClient
    ).getContractWrappers();

    if (account == null) {
      account = await this.ethereumClient.getAccount();
    }

    return await contractWrappers.erc20Token.setProxyAllowanceAsync(
      `0x${ethUtil.stripHexPrefix(this.address.toString().toLowerCase())}`,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      amount
    );
  }

  @time
  async send(to, amount) {
    const contractWrappers = await new ZeroExClient(
      this.ethereumClient
    ).getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const { decimals } = await this.get();
    const value = Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), decimals);
    return await contractWrappers.erc20Token.transferAsync(
      `0x${ethUtil.stripHexPrefix(this.address.toString().toLowerCase())}`,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      `0x${ethUtil.stripHexPrefix(to)}`.toLowerCase(),
      value
    );
  }
}
