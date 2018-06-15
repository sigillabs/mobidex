import * as _ from 'lodash';

let _store;

export function setStore(store) {
  _store = store;
}

export function getQuoteTicker(base, quote) {
  const {
    ticker: { token }
  } = _store.getState();

  if (base === 'WETH') base = 'ETH';

  if (!token) return null;
  if (!token[base]) return null;
  if (!token[base][quote]) return null;

  return token[base][quote];
}

export function getForexTicker(base, quote) {
  const {
    ticker: { forex }
  } = _store.getState();

  if (base === 'WETH') base = 'ETH';

  if (!forex) return null;
  if (!forex[base]) return null;
  if (!forex[base][quote]) return null;

  return forex[base][quote];
}
