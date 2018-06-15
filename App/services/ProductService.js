import * as _ from 'lodash';

let _store;

export function setStore(store) {
  _store = store;
}

export function filterProductsByTokenAddress(address) {
  const {
    relayer: { products }
  } = _store.getState();
  return _.filter(
    products,
    product => product.tokenA.address === address || product.tokenB.address
  );
}

export function filterProductsByQuoteToken() {
  const {
    relayer: { tokens },
    settings: { quoteSymbol }
  } = _store.getState();
  const quoteToken = _.find(tokens, { symbol: quoteSymbol });
  if (!quoteToken) return [];
  return filterProductsByTokenAddress(quoteToken.address);
}
