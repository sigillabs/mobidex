import { BigNumber } from '0x.js';
import { setGasPrice } from '../actions';
import EthGasStationInfo from '../clients/EthGasStationInfo.js';
import EtherChainGasPriceOracle from '../clients/EtherChainGasPriceOracle.js';
import { WalletService } from '../services/WalletService';

export function refreshGasPrice() {
  return async (dispatch, getState) => {
    const {
      settings: { gasLevel, gasStation }
    } = getState();
    let gasPrice = null;

    if (gasStation === 'eth-gas-station-info') {
      const client = new EthGasStationInfo();
      const estimates = await client.get();
      gasPrice = estimates[gasLevel];
    } else if (gasStation === 'ether-chain-gas-price-oracle') {
      const client = new EtherChainGasPriceOracle();
      const estimates = await client.get();
      gasPrice = estimates[gasLevel];
    } else {
      const web3 = WalletService.instance.web3;
      const ethGasPrice = await web3.eth.getGasPrice();
      gasPrice = new BigNumber(ethGasPrice);
    }

    dispatch(setGasPrice(gasPrice));

    return gasPrice;
  };
}
