import EthereumClient from '../clients/ethereum';
import {bigIntToEthHex, formatHexString} from '../lib/utils';
import TokenClient from '../clients/token';
import BaseService from './BaseService';
import {WalletService} from './WalletService';

export class GasService extends BaseService {
  async EthereumSend() {
    return 21000;
  }

  async TokenTransfer(tokenAddress, to, amount) {
    // const {
    //   settings: {
    //     uniswap: {factoryAddress},
    //   },
    // } = this.store.getState();

    const ethereumClient = new EthereumClient(WalletService.instance.web3);
    const tokenClient = new TokenClient(ethereumClient, tokenAddress);
    const contract = await tokenClient.getContract();
    const result = await contract.methods
      .transfer(formatHexString(to), bigIntToEthHex(amount))
      .estimateGas();
    return result;
  }
}
