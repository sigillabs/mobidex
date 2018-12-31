import { BigNumber, generatePseudoRandomSalt } from '0x.js';
import EthereumClient from '../clients/ethereum';
import ZeroExClient from '../clients/0x';
import {
  convertBigNumberToHexString,
  convertOrderBigNumberFieldsToHexStrings
} from '../utils/orders';
import { getWeb3 } from './WalletService';

export async function estimateMarketBuyOrders(orders, amount) {
  const web3 = getWeb3();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  const membershipContract = await zeroExClient.getMembershipContract();
  const account = await ethereumClient.getAccount();
  const signatures = orders.map(order => order.signature);
  const data = membershipContract.methods
    .marketBuyOrdersForMembers(
      orders.map(convertOrderBigNumberFieldsToHexStrings),
      convertBigNumberToHexString(amount),
      convertBigNumberToHexString(generatePseudoRandomSalt()),
      signatures
    )
    .encodeABI();
  const gas = await web3.eth.estimateGas({
    data,
    from: account,
    to: membershipContract.options.address
  });
  return new BigNumber(gas);
}

export async function estimateMarketSellOrders(orders, amount) {
  const web3 = getWeb3();
  const ethereumClient = new EthereumClient(web3);
  const zeroExClient = new ZeroExClient(ethereumClient);
  const membershipContract = await zeroExClient.getMembershipContract();
  const account = await ethereumClient.getAccount();
  const signatures = orders.map(order => order.signature);
  const data = membershipContract.methods
    .marketSellOrdersForMembers(
      orders.map(convertOrderBigNumberFieldsToHexStrings),
      convertBigNumberToHexString(amount),
      convertBigNumberToHexString(generatePseudoRandomSalt()),
      signatures
    )
    .encodeABI();
  const gas = await web3.eth.estimateGas({
    data,
    from: account,
    to: membershipContract.options.address
  });
  return new BigNumber(gas);
}
