import EthereumClient from '../clients/ethereum';
import UniswapClient from '../clients/Uniswap';
import BaseService from './BaseService';
import {WalletService} from './WalletService';

export class UniswapService extends BaseService {
  async getExchangeAddressForToken(tokenAddress) {
    const {
      settings: {
        uniswap: {factoryAddress},
      },
    } = this.store.getState();

    const ethereumClient = new EthereumClient(WalletService.instance.web3);
    const uniswapClient = new UniswapClient(ethereumClient, factoryAddress);
    const factoryContract = await uniswapClient.getFactoryContract();
    const exchangeAddress = await factoryContract.methods
      .getExchange(tokenAddress)
      .call();

    return exchangeAddress;
  }

  async getExchangeContract(exchangeAddress) {
    const {
      settings: {
        uniswap: {factoryAddress},
      },
    } = this.store.getState();

    const ethereumClient = new EthereumClient(WalletService.instance.web3);
    const uniswapClient = new UniswapClient(ethereumClient, factoryAddress);
    return await uniswapClient.getExchangeContract(exchangeAddress);
  }
}
