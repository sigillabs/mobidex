import { updateForexTickers, updateTokenTickers } from './inf0x';
import { loadAssets, loadOrderbooks, loadOrders, loadProducts } from './orders';
import { loadActiveTransactions, loadAllowances, loadBalances } from './wallet';

export function initialLoad(force = false) {
  return async dispatch => {
    await dispatch(loadProducts(force));
    await dispatch(loadAssets(force));
    await Promise.all([
      dispatch(loadAllowances(force)),
      dispatch(loadBalances(force)),
      dispatch(updateForexTickers(force)),
      dispatch(updateTokenTickers(force)),
      dispatch(loadActiveTransactions()),
      dispatch(loadOrders()),
      dispatch(loadOrderbooks())
    ]);
  };
}
