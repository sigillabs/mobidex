import { Linking } from 'react-native';
import EthereumClient from '../clients/ethereum';

export function gotoEtherScan(txaddr) {
  return async (dispatch, getState) => {
    const {
      wallet: { web3 }
    } = getState();
    const ethereumClient = new EthereumClient(web3);
    const networkId = await ethereumClient.getNetworkId();
    switch (networkId) {
      case 42:
        return await Linking.openURL(`https://kovan.etherscan.io/tx/${txaddr}`);

      default:
        return await Linking.openURL(`https://etherscan.io/tx/${txaddr}`);
    }
  };
}
