import { BigNumber } from '0x.js';
import { ZERO } from '../constants/0x';

let _store;

export function setStore(store) {
  _store = store;
}

export function getQuoteTicker(base, quote = null) {
  const {
    ticker: { token },
    settings: { quoteSymbol }
  } = _store.getState();

  if (!quote) quote = quoteSymbol;
  // This is the reverse of our normal logic.
  // inf0x works off of 0x contract logs.
  // WETH is in those logs.
  if (quote === 'ETH') quote = 'WETH';
  if (base === 'ETH') base = 'WETH';

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
  // This is the reverse of our normal logic.
  // inf0x works off of 0x contract logs.
  // WETH is in those logs.
  if (tokenSymbol === 'ETH') tokenSymbol = 'WETH';
  if (!forexSymbol) forexSymbol = forexCurrency;

  if (!forex) return null;
  if (!forex[tokenSymbol]) return null;
  if (!forex[tokenSymbol][forexSymbol]) return null;

  return forex[tokenSymbol][forexSymbol];
}

export function get24HRAverage(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.dayavg) return ZERO;

  return new BigNumber(ticker.dayavg);
}

export function get24HRMin(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.daymin) return ZERO;

  return new BigNumber(ticker.daymin);
}

export function get24HRMax(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.daymax) return ZERO;

  return new BigNumber(ticker.daymax);
}

export function get24HRChange(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.dayavg) return ZERO;
  if (!ticker.price) return ZERO;

  return new BigNumber(ticker.price).sub(ticker.dayavg);
}

export function get24HRChangePercent(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.dayavg) return ZERO;
  if (!ticker.price) return ZERO;

  return new BigNumber(ticker.price).sub(ticker.dayavg).div(ticker.dayavg);
}

export function getCurrentPrice(ticker) {
  if (!ticker) return ZERO;
  if (!ticker.price) return ZERO;

  return new BigNumber(ticker.price);
}
