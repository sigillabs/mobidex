import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import { time } from '../lib/decorators/cls';

/**
 * Fetches gas recommendations from https://ethgasstation.info
 * Response example:
{
  "average": 13.0,
  "avgWait": 2.0,
  "blockNum": 7165329,
  "block_time": 15.679144385026738,
  "fast": 40.0,
  "fastWait": 0.7,
  "fastest": 200.0,
  "fastestWait": 0.6,
  "safeLow": 11.0,
  "safeLowWait": 2.2,
  "speed": 0.4966788525885503
}
 * Wait times appear to be in minutes.
 */
export default class EthGasStationInfo {
  constructor(url = 'https://ethgasstation.info/json/ethgasAPI.json') {
    this.url = url;
  }

  @time
  async get() {
    const response = await fetch(this.url);
    const json = await response.json();
    const { average, avgWait, fast, fastWait, safeLow, safeLowWait } = json;

    return {
      low: Web3Wrapper.toBaseUnitAmount(new BigNumber(safeLow).div(10), 9),
      lowWait: safeLowWait,
      // medium: safeLow + (fast - safeLow) / 2,
      // mediumWait: safeLowWait - (safeLowWait - fastWait) / 2,
      standard: Web3Wrapper.toBaseUnitAmount(new BigNumber(average).div(10), 9),
      standardWait: avgWait,
      high: Web3Wrapper.toBaseUnitAmount(new BigNumber(fast).div(10), 9),
      highWait: fastWait
    };
  }
}
