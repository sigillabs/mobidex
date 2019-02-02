import { ordersChannelFactory } from '@0xproject/connect';
import { addOrders, updateForexTicker, updateTokenTicker } from '../actions';
import { Inf0xWebSocketClient } from '../clients/inf0x';
import TimerService from '../services/TimerService';
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
      // dispatch(updateForexTickers(forceLevel > 1)),
      // dispatch(updateTokenTickers(forceLevel > 1)),
      dispatch(loadOrderbooks(forceLevel > 1)),
      dispatch(loadOrders(forceLevel > 1)),
      dispatch(loadActiveTransactions(forceLevel > 0))
    ]);
  };
}

export function startWebsockets() {
  return async dispatch => {
    dispatch(startRelayerWebsockets());
    dispatch(startInf0xWebsockets());
  };
}

export function startRelayerWebsockets() {
  return async (dispatch, getState) => {
    const {
      relayer: { products },
      settings: { relayerWSS }
    } = getState();

    const ordersChannel = await ordersChannelFactory.createWebSocketOrdersChannelAsync(
      relayerWSS,
      {
        onClose: channel => {
          console.trace('relayer wss connection terminated -- restarting');

          TimerService.getInstance().setTimeout(
            () => dispatch(startRelayerWebsockets()),
            1
          );
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
        quoteAssetData: product.assetDataB.assetData,
        limit: 1000
      });
      ordersChannel.subscribe({
        baseAssetData: product.assetDataB.assetData,
        quoteAssetData: product.assetDataA.assetData,
        limit: 1000
      });
    }
  };
}

export function startInf0xWebsockets() {
  return async (dispatch, getState) => {
    const {
      relayer: { products, assets },
      settings: { forexCurrency, inf0xWSS }
    } = getState();

    const tickerChannel = await Inf0xWebSocketClient.getInf0xWebSocketClient(
      inf0xWSS,
      {
        onClose: (code, reason) => {
          console.warn('inf0x wss connection terminated -- restarting');
          TimerService.getInstance().setTimeout(
            () => dispatch(startInf0xWebsockets()),
            1
          );
        },
        onError: error => {
          console.warn(error);
        },
        onUpdate: (channel, ticker) => {
          if (channel === 'token-ticker') {
            dispatch(updateTokenTicker(ticker));
          } else if (channel === 'forex-ticker') {
            dispatch(updateForexTicker(ticker));
          }
        }
      }
    );
    for (const product of products) {
      tickerChannel.subscribeTokenTicker({
        traderAssetData: product.assetDataA.assetData
      });
      tickerChannel.subscribeTokenTicker({
        traderAssetData: product.assetDataB.assetData
      });
    }
    for (const asset of assets) {
      tickerChannel.subscribeForexTicker({
        symbol: asset.symbol,
        forex: forexCurrency
      });
    }
  };
}
