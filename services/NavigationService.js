import { Linking } from 'react-native';
import EthereumClient from '../clients/ethereum';
import { WalletService } from './WalletService';

export async function gotoEtherScan(txaddr) {
  const web3 = WalletService.instance.web3;

  const ethereumClient = new EthereumClient(web3);
  const networkId = await ethereumClient.getNetworkId();
  switch (networkId) {
    case 42:
      return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

    default:
      return await Linking.openURL(`https://etherscan.io/tx/${txaddr}`);
  }
}
