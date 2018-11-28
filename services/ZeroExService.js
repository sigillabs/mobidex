import { BigNumber } from '0x.js';
import ZeroExClient from '../clients/0x';
import EthereumClient from '../clients/ethereum';

let _store;

export async function estimateMarketBuyOrders(orders, amount) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  const wrappers = await zeroExClient.getContractWrappers();
  const transactionEncoder = await wrappers.exchange.transactionEncoderAsync();
  const account = await ethereumClient.getAccount();
  const gas = await web3.eth.estimateGas({
    from: account,
    data: transactionEncoder.marketBuyOrdersTx(orders, new BigNumber(amount)),
    to: wrappers.exchange.getContractAddress()
  });
  return new BigNumber(gas);
}

export async function estimateMarketSellOrders(orders, amount) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  const wrappers = await zeroExClient.getContractWrappers();
  const transactionEncoder = await wrappers.exchange.transactionEncoderAsync();
  const account = await ethereumClient.getAccount();
  const gas = await web3.eth.estimateGas({
    from: account,
    data: transactionEncoder.marketSellOrdersTx(orders, new BigNumber(amount)),
    to: wrappers.exchange.getContractAddress()
  });
  return new BigNumber(gas);
}

export function setStore(store) {
  _store = store;
}
