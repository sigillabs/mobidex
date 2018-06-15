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
