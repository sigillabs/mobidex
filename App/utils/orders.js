import * as _ from "lodash";
import { ZeroEx, Order as UnsignedOrder, SignedOrder } from "0x.js";

export async function signOrder(zeroEx, order, account) {
  order.salt = ZeroEx.generatePseudoRandomSalt();

  const hash = ZeroEx.getOrderHashHex(order);
  const ecSignature = await zeroEx.signOrderHashAsync(hash, account.toLowerCase());
  const { v, r, s } = ecSignature;

  return {
    ...order,
    ecSignature
  };
}
