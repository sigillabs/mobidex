import { ordersChannelFactory } from '@0xproject/connect';
import { addOrders } from '../actions';
import { updateForexTickers, updateTokenTickers } from './inf0x';
import { loadAssets, loadOrderbooks, loadOrders, loadProducts } from './orders';
import { loadActiveTransactions, loadAllowances, loadBalances } from './wallet';

export function initialLoad(forceLevel = 0) {
  return async dispatch => {
    await dispatch(loadProducts(forceLevel > 3));
    await dispatch(loadAssets(forceLevel > 3));
    await Promise.all([
      dispatch(loadAllowances(forceLevel > 2)),
      dispatch(loadBalances(forceLevel > 2)),
      dispatch(updateForexTickers(forceLevel > 1)),
      dispatch(updateTokenTickers(forceLevel > 1)),
      dispatch(loadActiveTransactions(forceLevel > 0)),
      dispatch(loadOrders(forceLevel > 0)),
      dispatch(loadOrderbooks(forceLevel > 0))
    ]);

    dispatch(startWebsockets());
  };
}

export function startWebsockets() {
  return async (dispatch, getState) => {
    const {
      relayer: { products },
      settings: { relayerWSS }
    } = getState();

    const ordersChannel = await ordersChannelFactory.createWebSocketOrdersChannelAsync(
      relayerWSS,
      {
        onClose: channel => {
          console.warn('relayer wss orders channel -- restarting');
          dispatch(startWebsockets());
        },
        onError: (channel, error, subscriptionOpts) => {
          console.warn('relayer wss error', channel, error, subscriptionOpts);
        },
        onUpdate: (channel, subscriptionOpts, orders) => {
          dispatch(addOrders(orders));
        }
      }
    );

    for (const product of products) {
      ordersChannel.subscribe({
        baseAssetData: product.assetDataA.assetData,
        quoteAssetData: product.assetDataB.assetData
      });
      ordersChannel.subscribe({
        baseAssetData: product.assetDataB.assetData,
        quoteAssetData: product.assetDataA.assetData
      });
    }
  };
}
