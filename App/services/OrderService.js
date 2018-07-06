import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import moment from 'moment';
import { addActiveTransactions } from '../../actions';
import {
  cancelOrder as _cancelOrder,
  fillOrder as _fillOrder,
  fillOrders as _fillOrders,
  gotoErrorScreen,
  setTokenAllowance,
  submitOrder as _submitOrder
} from '../../thunks';
import {
  filterAndSortOrdersByTokens,
  getAccount,
  getOrdersToFill,
  getTokenAllowance,
  getTokenBalance,
  getZeroExClient,
  getZeroExContractAddress
} from '../../utils';
import * as TokenService from './TokenService';

let _store;

export function setStore(store) {
  _store = store;
}

export function convertLimitOrderToZeroExOrder(limitOrder) {
  const {
    relayer: { tokens }
  } = _store.getState();

  const quoteToken = _.find(tokens, { address: limitOrder.quoteAddress });
  const baseToken = _.find(tokens, { address: limitOrder.baseAddress });

  if (!quoteToken) return null;
  if (!baseToken) return null;

  let order = {
    makerTokenAddress: null,
    makerTokenAmount: null,
    takerTokenAddress: null,
    takerTokenAmount: null
  };

  switch (limitOrder.side) {
    case 'buy':
      order.makerTokenAddress = quoteToken.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      order.takerTokenAddress = baseToken.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      break;

    case 'sell':
      order.makerTokenAddress = baseToken.address;
      order.makerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.amount).abs(),
        baseToken.decimals
      );
      order.takerTokenAddress = quoteToken.address;
      order.takerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(limitOrder.price).mul(limitOrder.amount).abs(),
        quoteToken.decimals
      );
      break;
  }

  return order;
}

export function convertZeroExOrderToLimitOrder(order, side) {
  const {
    relayer: { tokens }
  } = _store.getState();

  const makerToken = _.find(tokens, { address: order.makerTokenAddress });
  const takerToken = _.find(tokens, { address: order.takerTokenAddress });

  if (!makerToken) return null;
  if (!takerToken) return null;

  const makerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.makerTokenAmount),
    makerToken.decimals
  );
  const takerTokenUnitAmount = ZeroEx.toUnitAmount(
    new BigNumber(order.takerTokenAmount),
    takerToken.decimals
  );

  const limitOrder = {
    baseAddress: null,
    quoteAddress: null,
    price: null,
    amount: null,
    side
  };

  switch (side) {
    case 'buy':
      limitOrder.baseAddress = order.takerTokenAddress;
      limitOrder.quoteAddress = order.makerTokenAddress;
      limitOrder.price = makerTokenUnitAmount.div(takerTokenUnitAmount);
      limitOrder.amount = takerTokenUnitAmount;
      return limitOrder;

    case 'sell':
      limitOrder.baseAddress = order.takerTokenAddress;
      limitOrder.quoteAddress = order.makerTokenAddress;
      limitOrder.price = takerTokenUnitAmount.div(makerTokenUnitAmount);
      limitOrder.amount = makerTokenUnitAmount;
      return limitOrder;
  }

  return null;
}

export async function createOrder(limitOrder) {
  const {
    wallet: { address, web3 }
  } = _store.getState();
  return {
    ...convertLimitOrderToZeroExOrder(limitOrder),
    maker: `0x${address.toLowerCase()}`,
    makerFee: new BigNumber(0),
    taker: ZeroEx.NULL_ADDRESS,
    takerFee: new BigNumber(0),
    expirationUnixTimestampSec: new BigNumber(moment().unix() + 60 * 60 * 24),
    feeRecipient: ZeroEx.NULL_ADDRESS,
    salt: ZeroEx.generatePseudoRandomSalt(),
    exchangeContractAddress: await getZeroExContractAddress(web3)
  };
}

export async function signOrder(order) {
  try {
    const {
      wallet: { web3 }
    } = _store.getState();

    const zeroEx = await getZeroExClient(web3);
    const account = await getAccount(web3);

    if (!order.salt) order.salt = ZeroEx.generatePseudoRandomSalt();

    const hash = ZeroEx.getOrderHashHex(order);
    // Halting at signature -- seems like a performance issue.
    // Actually a network request issue.
    const ecSignature = await zeroEx.signOrderHashAsync(
      hash,
      account.toLowerCase()
    );

    return {
      ...order,
      orderHash: hash,
      ecSignature
    };
  } catch (err) {
    _store.dispatch(gotoErrorScreen(err));
    return null;
  }
}

export async function submitOrder(signedOrder) {
  await ensureWrappedEther(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount,
    true
  );
  await ensureTokenAllowance(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount
  );
  _store.dispatch(_submitOrder(signedOrder));
}

export async function fillOrders(orders, amount = null) {
  if (orders.length === 1) {
    return fillOrder(orders[0], amount);
  }

  const makerTokenAddresses = _.chain(orders)
    .map('makerTokenAddress')
    .uniq()
    .value();
  if (makerTokenAddresses.length > 1) {
    throw new Error('Orders contain different maker token addresses');
  }
  if (makerTokenAddresses.length < 1) {
    throw new Error('Need at least 1 order');
  }

  const takerTokenAddresses = _.chain(orders)
    .map('takerTokenAddress')
    .uniq()
    .value();
  if (takerTokenAddresses.length > 1) {
    throw new Error('Orders contain different taker token addresses');
  }
  if (takerTokenAddresses.length < 1) {
    throw new Error('Need at least 1 order');
  }

  const address = takerTokenAddresses[0];
  const takerToken = await TokenService.findTokenByAddress(address);
  const fullBaseUnitAmount = _.reduce(
    orders,
    (s, o) => s.add(o.takerTokenAmount),
    new BigNumber(0)
  );
  const baseUnitAmount = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount || 0),
    takerToken.decimals
  );
  const fillBaseUnitAmount = amount ? baseUnitAmount : fullBaseUnitAmount;
  const fillableOrders = amount
    ? getOrdersToFill(
        orders,
        makerTokenAddresses[0],
        address,
        fillBaseUnitAmount,
        true
      )
    : filterAndSortOrdersByTokens(orders, makerTokenAddresses[0], address);

  await ensureWrappedEther(
    takerToken.takerTokenAddress,
    fillBaseUnitAmount,
    true
  );
  await ensureTokenAllowance(address, fillBaseUnitAmount);
  await _store.dispatch(_fillOrders(fillableOrders, fillBaseUnitAmount));
}

export async function fillOrder(order, amount = null) {
  await ensureWrappedEther(
    order.takerTokenAddress,
    order.takerTokenAmount,
    true
  );
  await ensureTokenAllowance(order.takerTokenAddress, order.takerTokenAmount);
  await _store.dispatch(_fillOrder(order, amount));
}

export async function cancelOrder(order) {
  _store.dispatch(_cancelOrder(order));
}

export async function ensureTokenAllowance(address, amount) {
  const {
    wallet: { web3 }
  } = _store.getState();

  const allowance = await getTokenAllowance(web3, address);
  if (new BigNumber(amount).gt(allowance)) {
    _store.dispatch(setTokenAllowance(address));
  }
}

export async function ensureWrappedEther(address, amount, wei = false) {
  const {
    wallet: { web3 }
  } = _store.getState();

  const weth = await TokenService.getWETHToken();

  if ((address = weth.address)) {
    const baseAmount = wei
      ? new BigNumber(amount)
      : ZeroEx.toBaseUnitAmount(new BigNumber(amount), weth.decimals);
    const balance = await getTokenBalance(web3, address);
    if (new BigNumber(baseAmount).gt(balance)) {
      await wrapEther(new BigNumber(baseAmount).sub(balance), wei);
    }
  }
}

export async function wrapEther(amount, wei = false) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const { address, decimals } = await TokenService.getWETHToken();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const value = wei
    ? new BigNumber(amount)
    : ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);
  const txhash = await zeroEx.etherToken.depositAsync(
    address,
    value,
    account.toLowerCase()
  );

  if (txhash) {
    const activeTransaction = {
      id: txhash,
      type: 'WRAP_ETHER',
      address,
      amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    console.log('Receipt: ', receipt);
  }
}

export async function unwrapEther(amount, wei = false) {
  const {
    wallet: { web3 }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const { address, decimals } = await TokenService.getWETHToken();
  const value = wei
    ? new BigNumber(amount)
    : ZeroEx.toBaseUnitAmount(new BigNumber(amount), decimals);
  const txhash = await zeroEx.etherToken.withdrawAsync(
    address,
    value,
    account.toLowerCase()
  );

  if (txhash) {
    const activeTransaction = {
      id: txhash,
      type: 'UNWRAP_ETHER',
      address,
      amount
    };
    _store.dispatch(addActiveTransactions([activeTransaction]));
    const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
    console.log('Receipt: ', receipt);
  }
}
