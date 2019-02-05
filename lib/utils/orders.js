import { orderParsingUtils } from '@0xproject/order-utils';

export function fixOrders(orders) {
  if (!orders) return null;
  return orders
    .filter(order => Boolean(order))
    .map(orderParsingUtils.convertOrderStringFieldsToBigNumber);
}
