import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import { time } from '../lib/decorators/cls';

/**
 * Fetches gas recommendations from https://www.etherchain.org/tools/gasPriceOracle
 * Response example:
{
  "fast": "4.0",
  "fastest": "14.0",
  "safeLow": "1.1",
  "standard": "2.0"
}
 * Wait times is estimated based on https://www.etherchain.org/tools/gasPriceOracle.
 */
export default class EtherChainGasPriceOracle {
  constructor(url = 'https://www.etherchain.org/api/gasPriceOracle') {
    this.url = url;
  }

  @time
  async get() {
    /**

     */
    const response = await fetch(this.url);
    const json = await response.json();
    const { fast, safeLow, standard } = json;

    return {
      low: Web3Wrapper.toBaseUnitAmount(new BigNumber(safeLow), 9),
      lowWait: 30,
      standard: Web3Wrapper.toBaseUnitAmount(new BigNumber(standard), 9),
      standardWait: 5,
      high: Web3Wrapper.toBaseUnitAmount(new BigNumber(fast), 9),
      highWait: 1
    };
  }
}
