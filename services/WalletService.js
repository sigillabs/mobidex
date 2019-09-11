import {BigNumber} from '@uniswap/sdk';
import RNRestart from 'react-native-restart';
import Web3 from 'web3';
import EthereumClient from '../clients/ethereum';
import TokenClient from '../clients/token';
import {NULL_ADDRESS} from '../constants';
import {formatHexString} from '../lib/utils';
import {IntegratedWallet} from '../lib/wallets/integrated';
import {BitskiWallet} from '../lib/wallets/bitski';
import BaseService from './BaseService';

export class WalletService extends BaseService {
  constructor(store) {
    super(store);

    this.wallets = {};
    this.selected = null;
    this.web3 = null;
  }

  get wallet() {
    if (this.selected === null) return null;
    return this.wallets[this.selected];
  }

  get enabledWallets() {
    return Object.values(this.wallets).filter(wallet => wallet.available);
  }

  get readyWallets() {
    return Object.values(this.wallets).filter(wallet => wallet.ready);
  }

  get isReady() {
    return this.readyWallets.length > 0;
  }

  async initialize() {
    const {settings} = this.store.getState();

    this.wallets = {
      bitski: new BitskiWallet({
        ...settings,
        ...settings.bitski,
        network: settings.network,
      }),
      integrated: new IntegratedWallet(settings),
    };
    await Promise.all(this.enabledWallets.map(wallet => wallet.initialize()));
    for (const name in this.wallets) {
      if (this.wallets[name].ready) {
        this.selected = name;
        break;
      }
    }
    if (this.selected) {
      this.web3 = new Web3(this.wallet.provider);
    }
  }

  async supportsFingerPrintUnlock() {
    return this.wallet.supportsFingerPrintUnlock();
  }

  async supportsFaceIDUnlock() {
    return this.wallet.supportsFaceIDUnlock();
  }

  async supportsOffsiteUnlock() {
    return this.wallet.supportsOffsiteUnlock();
  }

  async cancelFingerPrintUnlock() {
    return this.wallet.cancelFingerPrintUnlock();
  }

  async getPrivateKey() {
    return this.wallet.getPrivateKey();
  }

  async getWalletAddress() {
    return this.wallet.getWalletAddress();
  }

  async removeWallet() {
    try {
      return await this.wallet.removeWallet();
    } finally {
      RNRestart.Restart();
    }
  }

  convertGasPriceToEth(gasPrice) {
    const web3 = this.web3;
    return new BigNumber(web3.utils.fromWei(gasPrice.toString()));
  }

  async estimateEthSend() {
    const web3 = this.web3;
    const ethereumClient = new EthereumClient(web3);
    return await ethereumClient.estimateGas(NULL_ADDRESS, undefined);
  }

  async estimateTokenSend(address, to, amount) {
    const web3 = this.web3;
    const ethereumClient = new EthereumClient(web3);
    const tokenAddress = formatHexString(address);
    const tokenClient = new TokenClient(ethereumClient, tokenAddress);
    const account = await ethereumClient.getAccount();
    const options = {
      from: formatHexString(account.toString()),
      data: await tokenClient.transferTx(to, amount),
      to: tokenAddress,
    };
    const gas = await web3.eth.estimateGas(options);
    return new BigNumber(gas);
  }
}
