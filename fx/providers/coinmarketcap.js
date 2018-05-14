import CoinMarketCap from 'coinmarketcap-api';

const client = new CoinMarketCap();

export function symbolToId(symbol) {
  switch (symbol) {
    case 'ZRX':
      return '0x';

    case 'MLN':
      return 'melon';

    case 'MKR':
      return 'maker';

    case 'DGD':
      return 'digixdao';

    case 'REP':
      return 'augur';

    case 'GNT':
      return 'golem';

    default:
    case 'ETH':
    case 'WETH':
      return 'ethereum';
  }
}

export async function price(
  options = { quoteCurrency: 'USD', baseCurrency: 'ethereum' }
) {
  let response = await fetch(
    `https://api.coinmarketcap.com/v1/ticker/${symbolToId(
      options.baseCurrency
    )}?convert=${options.quoteCurrency}`
  );
  let tickers = await response.json();

  if (tickers.error) {
    console.warn(tickers.error);
    return null;
  }

  let ticker = tickers[0];

  return ticker[`price_${options.quoteCurrency.toLowerCase()}`];
}
