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
