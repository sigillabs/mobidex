import * as _ from 'lodash';
import { InteractionManager } from 'react-native';
import { updateForexTicker, updateTokenTicker } from '../actions';
import Inf0xClient from '../clients/inf0x';

export function updateForexTickers(force = false) {
  return async (dispatch, getState) => {
    let {
      relayer: { assets },
      settings: { network, forexCurrency, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const products = assets.map(({ symbol }) => `${symbol}-${forexCurrency}`);

    const jsonResponse = await client.getForexTicker(products, force);
    InteractionManager.runAfterInteractions(() => {
      dispatch(updateForexTicker(jsonResponse));
    });
  };
}

export function updateTokenTickers(force = false) {
  return async (dispatch, getState) => {
    const {
      relayer: { products, assets },
      settings: { network, inf0xEndpoint }
    } = getState();
    const client = new Inf0xClient(inf0xEndpoint, { network });
    const _products = products
      .map(({ assetDataA, assetDataB }) => [
        _.find(assets, { address: assetDataA.address }),
        _.find(assets, { address: assetDataB.address })
      ])
      .filter(([tokenA, tokenB]) => tokenA && tokenB)
      .map(([tokenA, tokenB]) => `${tokenB.symbol}-${tokenA.symbol}`);
    const jsonResponse = await client.getTokenTicker(_products, force);
    InteractionManager.runAfterInteractions(() => {
      dispatch(updateTokenTicker(jsonResponse));
    });
  };
}
