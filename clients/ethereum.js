import {BigNumber} from '@uniswap/sdk';
import {cache, time} from '../lib/decorators/cls';
import {toBaseUnitAmount, toUnitAmount} from '../lib/utils';

export default class EthereumClient {
  constructor(web3, options = null) {
    this.web3 = web3;
    this.options = options;
  }

  getCurrentProvider() {
    return this.web3.currentProvider;
  }

  getWeb3() {
    return this.web3;
  }

  @time
  @cache('ethereum:balance', 60, false, data => new BigNumber(data))
  async getBalance() {
    const account = await this.getAccount();
    const balance = await this.web3.eth.getBalance(
      account.toString().toLowerCase(),
    );
    return new BigNumber(balance.toString());
  }

  @time
  @cache('ethereum:network-id', 10)
  async getNetworkId() {
    return this.web3.eth.net.getId();
  }

  @time
  @cache('ethereum:account', 10)
  async getAccount() {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }

  @time
  async getTransactionCount() {
    const account = await this.getAccount();
    return await this.web3.eth.getTransactionCount(account);
  }

  @time
  async estimateGas(to, data) {
    const account = await this.getAccount();
    return await this.web3.eth.estimateGas({
      from: account,
      to,
      data,
    });
  }

  @time
  async send(to, amount) {
    const sender = await this.getAccount();
    const value = toBaseUnitAmount(new BigNumber(amount), 18);
    const gasPrice = this.options ? this.options.gasPrice : undefined;
    return await new Promise((resolve, reject) => {
      const response = this.web3.eth.sendTransaction({
        from: sender,
        to,
        value,
        gasPrice,
      });
      response.on('transactionHash', hash => resolve(hash));
      response.on('error', error => reject(error));
    });
  }
}
