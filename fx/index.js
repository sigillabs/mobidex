import { price as cmcPrice } from "./providers/coinmarketcap.js";

export async function price(options = { quoteCurrency: "USD", baseCurrency: "ethereum" }) {
  if (!options) return null;
  if (!options.quoteCurrency) return null;
  if (!options.baseCurrency) return null;

  return await cmcPrice(options);
}
