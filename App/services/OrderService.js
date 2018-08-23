import { ZeroEx } from '0x.js';
import BigNumber from 'bignumber.js';
import ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import moment from 'moment';
import { addActiveTransactions } from '../../actions';
import {
  gotoErrorScreen,
  pushActiveServerTransactions,
  submitOrder as _submitOrder,
  updateActiveTransactionCache
} from '../../thunks';
import {
  getAccount,
  getOrdersToFill,
  getZeroExClient,
  getZeroExContractAddress
} from '../../utils';
import * as TokenService from './TokenService';
import * as WalletService from './WalletService';
import * as ZeroExService from './ZeroExService';

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
  await WalletService.checkAndWrapEther(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount,
    { wei: true, batch: true }
  );
  await WalletService.checkAndSetTokenAllowance(
    signedOrder.makerTokenAddress,
    signedOrder.makerTokenAmount,
    { wei: true, batch: true }
  );
  _store.dispatch(_submitOrder(signedOrder));
  _store.dispatch(pushActiveServerTransactions());
}

export async function fillOrders(orders, amount = null, side = 'buy') {
  if (!orders || orders.length === 0) {
    return;
  }

  if (orders.length === 1) {
    return await fillOrder(orders[0], amount, side);
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

  const orderRequests = await getOrdersBatch(orders, amount, side);
  const baseUnitAmount = _.reduce(
    orderRequests,
    (a, o) => a.add(o.takerTokenFillAmount),
    new BigNumber(0)
  );

  await WalletService.checkAndWrapEther(
    takerTokenAddresses[0],
    baseUnitAmount,
    { wei: true, batch: true }
  );
  await WalletService.checkAndSetTokenAllowance(
    takerTokenAddresses[0],
    baseUnitAmount,
    { wei: true, batch: true }
  );
  await ZeroExService.batchFillOrKill(orderRequests, amount, {
    wei: true,
    batch: true
  });

  _store.dispatch(pushActiveServerTransactions());
}

export async function fillOrder(order, amount = null, side = 'buy') {
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
      .mul(order.takerTokenAmount)
      .sub(order.filledTakerTokenAmount);

    // Rounding does not work
    // Big hack
    if (fillBaseUnitAmount.dp() > 0) {
      fillBaseUnitAmount = new BigNumber(
        fillBaseUnitAmount.toString().slice(0, -1 - fillBaseUnitAmount.dp())
      );
    }
  } else {
    fillBaseUnitAmount = order.takerTokenAmount;
  }

  const maxFillAmount = new BigNumber(order.takerTokenAmount).sub(
    order.filledTakerTokenAmount
  );

  if (fillBaseUnitAmount.gt(maxFillAmount)) {
    fillBaseUnitAmount = maxFillAmount;
  }

  await WalletService.checkAndWrapEther(
    order.takerTokenAddress,
    fillBaseUnitAmount,
    { wei: true, batch: true }
  );
  await WalletService.checkAndSetTokenAllowance(
    order.takerTokenAddress,
    fillBaseUnitAmount,
    { wei: true, batch: true }
  );
  await ZeroExService.fillOrder(order, fillBaseUnitAmount, amount, {
    wei: true,
    batch: true
  });

  _store.dispatch(pushActiveServerTransactions());
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
    await WalletService.checkAndUnwrapEther(
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
    ...order,
    id: txhash,
    type: 'CANCEL'
  };
  _store.dispatch(addActiveTransactions([activeTransaction]));
  _store.dispatch(updateActiveTransactionCache());
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
  let filledProperty;
  let tokenAddress;

  switch (side) {
    case 'buy':
      tokenAddress = orders[0].makerTokenAddress;
      amountProperty = 'makerTokenAmount';
      filledProperty = 'filledMakerTokenAmount';
      break;

    case 'sell':
      tokenAddress = orders[0].takerTokenAddress;
      amountProperty = 'takerTokenAmount';
      filledProperty = 'filledTakerTokenAmount';
      break;
  }

  const token = await TokenService.findTokenByAddress(tokenAddress);
  let amountBN = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount || 0),
    token.decimals
  );
  const ordersToFill = _.chain(orders)
    .map(o => {
      if (new BigNumber(o.filledTakerTokenAmount).gte(o.takerTokenAmount)) {
        return null;
      }

      if (new BigNumber(o[filledProperty]).gte(o[amountProperty])) {
        return null;
      }

      const fillable = new BigNumber(o[amountProperty]).sub(o[filledProperty]);

      if (amount === null || amountBN.gt(fillable)) {
        amountBN = amountBN.sub(fillable);
        return {
          signedOrder: o,
          takerTokenFillAmount: new BigNumber(o.takerTokenAmount).sub(
            o.filledTakerTokenAmount
          )
        };
      } else {
        const ratio = amountBN.div(o[amountProperty]);
        let fillAmount = ratio.mul(o.takerTokenAmount);

        // Rounding does not work
        // Big hack
        if (fillAmount.dp() > 0) {
          fillAmount = new BigNumber(
            fillAmount.toString().slice(0, -1 - fillAmount.dp())
          );
        }

        const maxFillAmount = new BigNumber(o.takerTokenAmount).sub(
          o.filledTakerTokenAmount
        );

        return {
          signedOrder: o,
          takerTokenFillAmount: fillAmount.gt(maxFillAmount)
            ? maxFillAmount
            : fillAmount
        };
      }
    })
    .filter(_.identity)
    .filter(({ takerTokenFillAmount }) => !takerTokenFillAmount.lte(0))
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
