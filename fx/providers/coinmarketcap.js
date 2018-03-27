import * as CoinMarketCap from "coinmarketcap-api";

const client = new CoinMarketCap();

export async function price(options = { quoteCurrency: "USD", baseCurrency: "ethereum" }) {
  let ticker = await client.getTicker({
    convert: options.quoteCurrency.toLowerCase(),
    currency: options.baseCurrency
  });

  return ticker[0][`price_${options.quoteCurrency.toLowerCase()}`];
}
