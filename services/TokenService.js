import * as _ from 'lodash';

let _store;

export function setStore(store) {
  _store = store;
}

export function findTokenByAddress(address) {
  const {
    relayer: { tokens }
  } = _store.getState();
  return _.find(tokens, { address });
}

export function findTokenBySymbol(symbol) {
  const {
    relayer: { tokens }
  } = _store.getState();
  return _.find(tokens, { symbol });
}

export function getQuoteToken() {
  const {
    relayer: { tokens },
    settings: { quoteSymbol }
  } = _store.getState();
  return _.find(tokens, { symbol: quoteSymbol });
}

export function getWETHToken() {
  const {
    relayer: { tokens }
  } = _store.getState();
  return _.find(tokens, { symbol: 'WETH' });
}
