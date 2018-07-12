import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import moment from 'moment';
import { addActiveTransactions } from '../../actions';
import {
  gotoErrorScreen,
  setTokenAllowance,
  submitOrder as _submitOrder
} from '../../thunks';
import {
  getAccount,
  getOrdersToFill,
  getTokenAllowance,
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

export function convertZeroExOrderToLimitOrder(order, side = 'buy') {
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
  await checkAndWrapEther(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount,
    true
  );
  await checkAndSetTokenAllowance(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount
  );
  _store.dispatch(_submitOrder(signedOrder));
}

export async function fillOrders(orders, amount = null, side = 'buy') {
  const {
    wallet: { web3 }
  } = _store.getState();

  if (!orders || orders.length === 0) {
    return;
  }

  if (orders.length === 1) {
    return fillOrder(orders[0], amount, side);
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

  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  const fillOrders = await getOrdersBatch(orders, amount, side);
  const baseUnitAmount = _.reduce(
    fillOrders,
    (a, o) => a.add(o.takerTokenFillAmount),
    new BigNumber(0)
  );

  await checkAndWrapEther(takerTokenAddresses[0], baseUnitAmount, true);
  await checkAndSetTokenAllowance(takerTokenAddresses[0], baseUnitAmount);

  const txhash = await zeroEx.exchange.batchFillOrKillAsync(
    fillOrders,
    account.toLowerCase(),
    { shouldValidate: true }
  );
  const activeTransaction = {
    id: txhash,
    type: 'BATCH_FILL',
    amount: amount
  };
  _store.dispatch(addActiveTransactions([activeTransaction]));
  const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
  console.log('Receipt: ', receipt);
}

export async function fillOrder(order, amount = null, side = 'buy') {
  const {
    wallet: { web3 }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);
  const account = await getAccount(web3);
  let orderAmount;
  let fillBaseUnitAmount;
  let token;

  switch (side) {
    case 'buy':
      orderAmount = order.makerTokenAmount;
      token = await TokenService.findTokenByAddress(order.makerTokenAddress);
      break;

    case 'sell':
      orderAmount = order.takerTokenAmount;
      token = await TokenService.findTokenByAddress(order.takerTokenAddress);
      break;
  }

  if (amount) {
    fillBaseUnitAmount = ZeroEx.toBaseUnitAmount(
      new BigNumber(amount),
      token.decimals
    )
      .div(orderAmount)
      .mul(order.takerTokenAmount);
  } else {
    fillBaseUnitAmount = order.takerTokenAmount;
  }

  await checkAndWrapEther(order.takerTokenAddress, fillBaseUnitAmount, true);
  await checkAndSetTokenAllowance(order.takerTokenAddress, fillBaseUnitAmount);

  const txhash = await zeroEx.exchange.fillOrderAsync(
    order,
    fillBaseUnitAmount,
    true,
    account.toLowerCase(),
    { shouldValidate: true }
  );
  const activeTransaction = {
    id: txhash,
    type: 'FILL',
    ...order
  };
  _store.dispatch(addActiveTransactions([activeTransaction]));
  const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
  console.log('Receipt: ', receipt);
}

export async function cancelOrder(order) {
  const {
    wallet: { web3, address }
  } = _store.getState();
  const zeroEx = await getZeroExClient(web3);

  if (ethUtil.stripHexPrefix(order.maker) !== ethUtil.stripHexPrefix(address)) {
    throw new Error('Cannot cancel order that is not yours');
  }

  try {
    await checkAndUnwrapEther(
      order.makerTokenAddress,
      order.makerTokenAmount,
      true
    );
  } catch (err) {
    console.warn(err);
    if (err.message !== 'INSUFFICIENT_WETH_BALANCE_FOR_WITHDRAWAL') {
      throw err;
    }
  }

  const txhash = await zeroEx.exchange.cancelOrderAsync(
    order,
    new BigNumber(order.makerTokenAmount)
  );

  const activeTransaction = {
    id: txhash,
    type: 'CANCEL',
    ...order
  };
  _store.dispatch(addActiveTransactions([activeTransaction]));
  const receipt = await zeroEx.awaitTransactionMinedAsync(txhash);
  console.log('Receipt: ', receipt);
}

export async function checkAndSetTokenAllowance(address, amount) {
  const {
    wallet: { web3 }
  } = _store.getState();

  const allowance = await getTokenAllowance(web3, address);
  if (new BigNumber(amount).gt(allowance)) {
    await _store.dispatch(setTokenAllowance(address));
  }
}

export async function checkAndWrapEther(address, amount, wei = false) {
  const weth = await TokenService.getWETHToken();

  if (address === weth.address) {
    await wrapEther(amount, wei);
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

export async function checkAndUnwrapEther(address, amount, wei = false) {
  const weth = await TokenService.getWETHToken();

  if (address === weth.address) {
    await unwrapEther(amount, wei);
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

export async function getFillableOrders(base, amount, side = 'buy') {
  if (side !== 'buy' && side !== 'sell') {
    return null;
  }

  const {
    relayer: { orders }
  } = _store.getState();
  const quote = await TokenService.getQuoteToken();

  if (typeof base === 'string') {
    base = await TokenService.findTokenByAddress(base);
  }

  let makerToken;
  let takerToken;
  let taker;

  switch (side) {
    case 'buy':
      makerToken = base;
      takerToken = quote;
      taker = false;
      break;

    case 'sell':
      makerToken = quote;
      takerToken = base;
      taker = true;
      break;
  }

  const baseUnitAmount = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount),
    base.decimals
  );

  const fillableOrders = getOrdersToFill(
    orders,
    makerToken.address,
    takerToken.address,
    baseUnitAmount,
    taker
  );

  return fillableOrders;
}

export async function getOrdersBatch(orders, amount = null, side = 'buy') {
  if (!orders) return null;
  if (orders.length === 0) return orders;
  let amountProperty;
  let tokenAddress;

  switch (side) {
    case 'buy':
      tokenAddress = orders[0].makerTokenAddress;
      amountProperty = 'makerTokenAmount';
      break;

    case 'sell':
      tokenAddress = orders[0].takerTokenAddress;
      amountProperty = 'takerTokenAmount';
      break;
  }

  const token = await TokenService.findTokenByAddress(tokenAddress);
  let amountBN = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount || 0),
    token.decimals
  );
  const ordersToFill = _.chain(orders)
    .map(o => {
      if (amount === null || amountBN.gt(o.takerTokenAmount)) {
        amountBN = amountBN.sub(o[amountProperty]);
        return {
          signedOrder: o,
          takerTokenFillAmount: new BigNumber(o.takerTokenAmount)
        };
      } else {
        const ratio = amountBN.div(o[amountProperty]);
        return {
          signedOrder: o,
          takerTokenFillAmount: ratio.mul(o.takerTokenAmount)
        };
      }
    })
    .filter(_.identity)
    .value();

  return ordersToFill;
}

export async function getAveragePrice(orders, side = 'buy') {
  if (orders.length === 0) {
    return 0;
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

  const makerToken = await TokenService.findTokenByAddress(
    makerTokenAddresses[0]
  );
  const takerToken = await TokenService.findTokenByAddress(
    takerTokenAddresses[0]
  );

  let average = null;

  switch (side) {
    case 'buy':
      average = orders.reduce(
        (s, o) =>
          s.add(
            ZeroEx.toUnitAmount(o.takerTokenAmount, takerToken.decimals)
              .div(ZeroEx.toUnitAmount(o.makerTokenAmount, makerToken.decimals))
              .div(orders.length)
          ),
        new BigNumber(0)
      );
      break;

    case 'sell':
      average = orders.reduce(
        (s, o) =>
          s.add(
            ZeroEx.toUnitAmount(o.makerTokenAmount, makerToken.decimals)
              .div(ZeroEx.toUnitAmount(o.takerTokenAmount, takerToken.decimals))
              .div(orders.length)
          ),
        new BigNumber(0)
      );
      break;
  }

  return average.toNumber();
}
