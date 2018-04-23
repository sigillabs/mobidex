export async function prices(symbol, regress = 24 * 60 * 60) {
  const response = await fetch(
    `https://mobidex.io/inf0x/${symbol}/prices?regress=${regress}`
  );
  return await response.json();
}
