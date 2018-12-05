import { Linking } from 'react-native';
import EthereumClient from '../clients/ethereum';
import * as WalletService from './WalletService';

export async function gotoEtherScan(txaddr) {
  const web3 = WalletService.getWeb3();

  const ethereumClient = new EthereumClient(web3);
  const networkId = await ethereumClient.getNetworkId();
  switch (networkId) {
    case 42:
      return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

    default:
      return await Linking.openURL(`https://etherscan.io/tx/${txaddr}`);
  }
}
