import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';

export const UniswapReserveTokenProp = PropTypes.shape({
  chainId: PropTypes.number.isRequired,
  address: PropTypes.string.isRequired,
  decimals: PropTypes.number.isRequired,
});

export const UniswapTokenAmountProp = PropTypes.shape({
  token: UniswapReserveTokenProp.isRequired,
  amount: PropTypes.instanceOf(BigNumber).isRequired,
});

export const UniswapMarketRate = PropTypes.shape({
  rate: PropTypes.instanceOf(BigNumber).isRequired,
  rateInverted: PropTypes.instanceOf(BigNumber).isRequired,
}).isRequired;

export const UniswapReserveProp = PropTypes.shape({
  token: UniswapReserveTokenProp.isRequired,
  exchange: UniswapReserveTokenProp.isRequired,
  ethReserve: UniswapTokenAmountProp.isRequired,
  tokenReserve: UniswapTokenAmountProp.isRequired,
});

export const UniswapMarketDetailsProp = PropTypes.shape({
  tradeType: PropTypes.string.isRequired,
  inputReserves: PropTypes.shape({
    token: UniswapReserveTokenProp.isRequired,
  }).isRequired,
  outputReserves: UniswapReserveProp.isRequired,
  marketRate: UniswapMarketRate.isRequired,
});

export const UniswapTradeDetailsProp = PropTypes.shape({
  marketDetailsPre: UniswapMarketDetailsProp.isRequired,
  marketDetailsPost: UniswapMarketDetailsProp.isRequired,
  tradeType: PropTypes.string.isRequired,
  tradeExact: PropTypes.string.isRequired,
  inputAmount: UniswapTokenAmountProp.isRequired,
  outputAmount: UniswapTokenAmountProp.isRequired,
  executionRate: UniswapMarketRate.isRequired,
  marketRateSlippage: PropTypes.string.isRequired,
  executionRateSlippage: PropTypes.instanceOf(BigNumber).isRequired,
});

export const UniswapExecutionDetailsProp = PropTypes.shape({
  exchangeAddress: PropTypes.string.isRequired,
  methodName: PropTypes.string.isRequired,
  methodId: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(BigNumber).isRequired,
  methodArguments: PropTypes.array.isRequired,
});
