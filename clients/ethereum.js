import { ZeroEx } from '0x.js';
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
  @cache('ethereum:balance', 10 * 1000)
  async getBalance() {
    let account = await this.getAccount();
    return await new Promise((resolve, reject) => {
      this.web3.eth.getBalance(
        account.toString().toLowerCase(),
        (err, balance) => {
          if (err) {
            reject(err);
          } else {
            resolve(balance);
          }
        }
      );
    });
  }

  @time
  @cache('ethereum:network-id', 10 * 1000)
  async getNetworkId() {
    return await new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err, network) => {
        if (err) {
          reject(err);
        } else {
          resolve(parseInt(network));
        }
      });
    });
  }

  @time
  @cache('ethereum:account', 10 * 1000)
  async getAccount() {
    return await new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err, accounts) => {
        if (err) {
          reject(err);
        } else {
          resolve(accounts[0]);
        }
      });
    });
  }

  @time
  async getTransactionCount() {
    const account = await this.getAccount();
    return await new Promise((resolve, reject) => {
      this.web3.eth.getTransactionCount(account, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  @time
  async estimateGas(to, data) {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      this.web3.eth.estimateGas(
        {
          from: account,
          to,
          data
        },
        (err, result) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        }
      );
    });
  }

  @time
  async send(to, amount) {
    let sender = await this.ethereumClient.getAccount();
    let value = ZeroEx.toBaseUnitAmount(new BigNumber(amount), 18).toString();
    return await new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({ from: sender, to, value }, function(
        err,
        transactionHash
      ) {
        if (err) return reject(err);
        return resolve(transactionHash);
      });
    });
  }
}
