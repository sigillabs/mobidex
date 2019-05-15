import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { assetDataUtils, BigNumber } from '0x.js';
import * as _ from 'lodash';
import RNRestart from 'react-native-restart';
import Web3 from 'web3';
import ZeroExClient from '../clients/0x';
import EthereumClient from '../clients/ethereum';
import EtherToken from '../clients/EtherToken';
import TokenClient from '../clients/token';
import { ZERO, NULL_ADDRESS, MAX } from '../constants/0x';
import { formatHexString } from '../lib/utils/format';
import { IntegratedWallet } from '../lib/wallets/integrated';
import { BitskiWallet } from '../lib/wallets/bitski';
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

  async initialize() {
    const { settings } = this.store.getState();

    this.wallets = {
      bitski: new BitskiWallet({
        ...settings,
        ...settings.bitski,
        network: settings.network
      }),
      integrated: new IntegratedWallet(settings)
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

  async signTransaction() {
    return this.wallet.signTransaction();
  }

  async signMessage() {
    return this.wallet.signMessage();
  }

  async removeWallet() {
    try {
      return await this.wallet.removeWallet();
    } finally {
      RNRestart.Restart();
    }
  }

  getBalanceByAddress(address) {
    const {
      wallet: { balances },
      relayer: { assets }
    } = this.store.getState();
    if (!address) {
      if (!balances[null]) {
        return ZERO;
      } else {
        return Web3Wrapper.toUnitAmount(new BigNumber(balances[null]), 18);
      }
    }

    const asset = _.find(assets, { address });
    if (!asset) return ZERO;
    if (!balances[address]) return ZERO;
    return Web3Wrapper.toUnitAmount(
      new BigNumber(balances[address]),
      asset.decimals
    );
  }

  getBalanceBySymbol(symbol) {
    const {
      wallet: { balances },
      relayer: { assets }
    } = this.store.getState();

    if (!symbol) return this.getBalanceByAddress();

    const asset = _.find(assets, { symbol });
    if (!asset) return ZERO;
    if (!balances[asset.address]) return ZERO;
    return Web3Wrapper.toUnitAmount(
      new BigNumber(balances[asset.address]),
      asset.decimals
    );
  }

  getBalanceByAssetData(assetData) {
    if (!assetData) {
      return this.getBalanceByAddress(null);
    }

    const address = assetDataUtils.decodeERC20AssetData(assetData).tokenAddress;
    return this.getBalanceByAddress(address);
  }

  getAllowanceByAssetData(assetData) {
    if (!assetData) {
      return this.getAllowanceByAddress(null);
    }

    const address = assetDataUtils.decodeERC20AssetData(assetData).tokenAddress;
    return this.getAllowanceByAddress(address);
  }

  getAllowanceByAddress(address) {
    const {
      wallet: { allowances },
      relayer: { assets }
    } = this.store.getState();
    if (!address) {
      return ZERO;
    }

    const asset = _.find(assets, { address });
    if (!asset) return ZERO;
    if (!allowances[address]) return ZERO;
    return Web3Wrapper.toUnitAmount(
      new BigNumber(allowances[address]),
      asset.decimals
    );
  }

  getAllowanceBySymbol(symbol) {
    const {
      wallet: { allowances },
      relayer: { assets }
    } = this.store.getState();
    if (!symbol) return ZERO;

    const asset = _.find(assets, { symbol });
    if (!asset) return ZERO;
    if (!allowances[asset.address]) return ZERO;
    return Web3Wrapper.toUnitAmount(
      new BigNumber(allowances[asset.address]),
      asset.decimals
    );
  }

  isUnlockedByAssetData(assetData) {
    if (assetData) {
      const address = assetDataUtils.decodeERC20AssetData(assetData)
        .tokenAddress;
      return this.isUnlockedByAddress(address);
    } else {
      return true;
    }
  }

  isUnlockedByAddress(address) {
    const {
      wallet: { allowances },
      relayer: { assets }
    } = this.store.getState();
    if (!address) {
      return false;
    }

    const asset = _.find(assets, { address });
    if (!asset) return false;
    if (!allowances[address]) return false;
    return MAX.eq(allowances[address]);
  }

  isUnlockedBySymbol(symbol) {
    const {
      wallet: { allowances },
      relayer: { assets }
    } = this.store.getState();
    if (!symbol) {
      return false;
    }

    const asset = _.find(assets, { symbol });
    if (!asset) return false;
    if (!allowances[asset.address]) return false;
    return MAX.eq(allowances[asset.address]);
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
      to: tokenAddress
    };
    const gas = await web3.eth.estimateGas(options);
    return new BigNumber(gas);
  }

  async estimateDeposit(amount) {
    const web3 = this.web3;
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const WETH9Address = await zeroExClient.getWETHTokenAddress();
    const etherTokenClient = new EtherToken(ethereumClient, WETH9Address);
    const account = await ethereumClient.getAccount();
    const options = {
      from: formatHexString(account.toString()),
      data: await etherTokenClient.depositTx(),
      value: amount.toString(),
      to: WETH9Address
    };
    const gas = await web3.eth.estimateGas(options);
    return new BigNumber(gas);
  }

  async estimateWithdraw(amount) {
    const web3 = this.web3;
    const ethereumClient = new EthereumClient(web3);
    const zeroExClient = new ZeroExClient(ethereumClient);
    const WETH9Address = await zeroExClient.getWETHTokenAddress();
    const etherTokenClient = new EtherToken(ethereumClient, WETH9Address);
    const account = await ethereumClient.getAccount();
    const options = {
      from: formatHexString(account.toString()),
      data: await etherTokenClient.withdrawTx(amount),
      to: WETH9Address
    };
    const gas = await web3.eth.estimateGas(options);
    return new BigNumber(gas);
  }
}
