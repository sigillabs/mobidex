import { ordersChannelFactory } from '@0xproject/connect';
import {
  appendOrderbook,
  finishedFirstLoad,
  updateForexTicker,
  updateTokenTicker
} from '../actions';
import { Inf0xWebSocketClient } from '../clients/inf0x';
import { setOfflineRoot } from '../navigation';
import TimerService from '../services/TimerService';
import { loadAssets, loadProducts } from './orders';

export function initialLoad(forceLevel = 0) {
  return async (dispatch, getState) => {
    const {
      settings: { firstLoad }
    } = getState();

    if (firstLoad || forceLevel > 1) {
      await dispatch(loadProducts(forceLevel > 3));
      await dispatch(loadAssets(forceLevel > 3));
      dispatch(finishedFirstLoad());
    }
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
          console.warn(
            'relayer wss error',
            channel,
            error.message,
            subscriptionOpts
          );
          if (~error.message.indexOf('Network is down')) {
            setOfflineRoot();
          }
        },
        onUpdate: (channel, subscriptionOpts, orders) => {
          dispatch(appendOrderbook(orders));
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
          console.warn(error.message);
          if (~error.message.indexOf('Network is down')) {
            setOfflineRoot();
          }
        },
        onUpdate: (channel, tickers) => {
          if (channel === 'token-ticker') {
            for (const ticker of tickers) {
              dispatch(updateTokenTicker(ticker));
            }
          } else if (channel === 'forex-ticker') {
            for (const ticker of tickers) {
              dispatch(updateForexTicker(ticker));
            }
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
