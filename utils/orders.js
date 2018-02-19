import * as _ from "lodash";
import { ZeroEx, Order as UnsignedOrder, SignedOrder } from "0x.js";
import { getZeroExClient, getAccount } from "./ethereum";

export async function signOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);

  order.salt = ZeroEx.generatePseudoRandomSalt();

  const hash = ZeroEx.getOrderHashHex(order);
  // Halting at signature -- seems like a performance issue.
  // Actually a network request issue.
  const ecSignature = await zeroEx.signOrderHashAsync(hash, account.toLowerCase());
  const { v, r, s } = ecSignature;

  return {
    ...order,
    orderHash: hash,
    ecSignature
  };
}

export async function fillOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const fillAmount = order.takerTokenAmount;
  return await zeroEx.exchange.fillOrderAsync(order, fillAmount, true, account.toLowerCase());
  // const receipt = await zeroEx.awaitTransactionMinedAsync(txHash);
}

export async function cancelOrder(web3, order) {
  const zeroEx = await getZeroExClient(web3);
  const txHash = await zeroEx.exchange.cancelOrderAsync(order);
  return txHash;
  // const receipt = await zeroEx.awaitTransactionMinedAsync(txHash);
}
