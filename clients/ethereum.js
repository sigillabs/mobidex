import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import { cache, time } from '../decorators/cls';

export default class EthereumClient {
  constructor(web3) {
    this.web3 = web3;
  }

  getCurrentProvider() {
    return this.web3.currentProvider;
  }

  getWeb3() {
    return this.web3;
  }

  @time
  @cache('ethereum:balance', 60)
  async getBalance() {
    const account = await this.getAccount();
    const balance = await this.web3.eth.getBalance(
      account.toString().toLowerCase()
    );
    return new BigNumber(balance);
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
      data
    });
  }

  @time
  async send(to, amount) {
    const sender = await this.getAccount();
    const value = Web3Wrapper.toBaseUnitAmount(new BigNumber(amount), 18);
    return await new Promise((resolve, reject) => {
      const response = this.web3.eth.sendTransaction({
        from: sender,
        to,
        value
      });
      response.on('transactionHash', hash => resolve(hash));
      response.on('error', error => reject(error));
    });
  }
}
