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

export function getForexTicker(tokenSymbol = null, forexSymbol = null) {
  const {
    ticker: { forex },
    settings: { forexCurrency, quoteSymbol }
  } = _store.getState();

  if (!tokenSymbol) tokenSymbol = quoteSymbol;
  if (tokenSymbol === 'WETH') tokenSymbol = 'ETH';
  if (!forexSymbol) forexSymbol = forexCurrency;

  if (!forex) return null;
  if (!forex[tokenSymbol]) return null;
  if (!forex[tokenSymbol][forexSymbol]) return null;

  return forex[tokenSymbol][forexSymbol];
}
