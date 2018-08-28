import BigNumber from 'bignumber.js';

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
  if (!ticker) return new BigNumber(0);
  if (!ticker.price) return new BigNumber(0);
  if (!ticker.history) return new BigNumber(0);
  if (!ticker.history.day) return new BigNumber(0);
  if (!ticker.history.day.length) return new BigNumber(0);

  const prices = ticker.history.day.map(({ price }) => new BigNumber(price));

  return prices
    .reduce((sum, price) => sum.add(price), new BigNumber(0))
    .div(prices.length);
}

export function get24HRMin(ticker) {
  if (!ticker) return new BigNumber(0);
  if (!ticker.daymin) return new BigNumber(0);

  return new BigNumber(ticker.daymin);
}

export function get24HRMax(ticker) {
  if (!ticker) return new BigNumber(0);
  if (!ticker.daymax) return new BigNumber(0);

  return new BigNumber(ticker.daymax);
}

export function get24HRChange(ticker) {
  if (!ticker) return new BigNumber(0);
  if (!ticker.price) return new BigNumber(0);
  if (!ticker.history) return new BigNumber(0);
  if (!ticker.history.day) return new BigNumber(0);
  if (!ticker.history.day.length) return new BigNumber(0);

  const start = new BigNumber(
    ticker.history.day[ticker.history.day.length - 1].price
  );
  const end = new BigNumber(ticker.history.day[0].price);

  return end.sub(start);
}

export function get24HRChangePercent(ticker) {
  if (!ticker) return new BigNumber(0);
  if (!ticker.price) return new BigNumber(0);
  if (!ticker.history) return new BigNumber(0);
  if (!ticker.history.day) return new BigNumber(0);
  if (!ticker.history.day.length) return new BigNumber(0);

  const start = new BigNumber(
    ticker.history.day[ticker.history.day.length - 1].price
  );
  const end = new BigNumber(ticker.history.day[0].price);

  if (start.eq(0)) {
    return new BigNumber(0);
  }

  return end.sub(start).div(start);
}

export function getCurrentPrice(ticker) {
  if (!ticker) return new BigNumber(0);
  if (!ticker.price) return new BigNumber(0);

  return new BigNumber(ticker.price);
}
