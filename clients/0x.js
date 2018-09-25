import { BigNumber, ContractWrappers, SignerType, signatureUtils } from '0x.js';
import ethUtil from 'ethereumjs-util';
import { cache, time } from '../decorators/cls';

const TokenABI = require('../abi/Token.json');
const BytesTokenABI = require('../abi/BytesToken.json');

export default class ZeroExClient {
  static NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
  static ZERO = new BigNumber(0);

  constructor(ethereumClient) {
    this.ethereumClient = ethereumClient;
  }

  @time
  async getContractWrappers() {
    return new ContractWrappers(this.ethereumClient.getCurrentProvider(), {
      networkId: await this.ethereumClient.getNetworkId()
    });
  }

  @time
  @cache('0x:v2:exchange:address', 60 * 60 * 24)
  async getExchangeContractAddress() {
    const wrappers = await this.getContractWrappers();
    return wrappers.exchange.getContractAddress();
  }

  @time
  @cache('0x:v2:exchange:ZRX:address', 60 * 60 * 24)
  async getZRXTokenAddress() {
    const wrappers = await this.getContractWrappers();
    return wrappers.exchange.getZRXTokenAddress();
  }

  @time
  @cache('0x:v2:ether-token:WETH:address', 60 * 60 * 24)
  async getWETHTokenAddress() {
    const wrappers = await this.getContractWrappers();
    return (
      wrappers.etherToken.getContractAddressIfExists() ||
      '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    );
  }

  @time
  @cache('0x:v2:exchange:order:filled:{}', 60)
  async getFilledTakerAmount(orderHash) {
    const wrappers = await this.getContractWrappers();
    return wrappers.exchange.getFilledTakerAssetAmountAsync(orderHash);
  }

  @time
  async signOrderHash(orderHash) {
    const account = await this.ethereumClient.getAccount();
    const signature = await signatureUtils.ecSignOrderHashAsync(
      this.ethereumClient.getCurrentProvider(),
      orderHash,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      SignerType.Metamask
    );
    return signature;
  }

  @time
  async depositEther(amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const WETHAddress = await this.getWETHTokenAddress();
    return await wrappers.etherToken.depositAsync(
      WETHAddress,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async withdrawEther(amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const WETHAddress = await this.getWETHTokenAddress();
    return await wrappers.etherToken.withdrawAsync(
      WETHAddress,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async fillOrKillOrder(order, amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    return await wrappers.exchange.fillOrKillOrderAsync(
      order,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: false }
    );
  }

  @time
  async fillOrKillOrders(orders, amounts) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    return await wrappers.exchange.batchFillOrKillOrdersAsync(
      orders,
      amounts.map(amount => new BigNumber(amount)),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: false }
    );
  }

  @time
  async cancelOrder(order) {
    const wrappers = await this.getContractWrappers();
    return await wrappers.exchange.cancelOrderAsync(order, {
      shouldValidate: false
    });
  }

  @time
  async marketBuyWithEth(
    orders,
    feeOrders,
    feePercentage,
    feeRecipient,
    amount
  ) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const balance = await this.ethereumClient.getBalance(false);
    return await wrappers.forwarder.marketBuyOrdersWithEthAsync(
      orders,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      new BigNumber(balance),
      feeOrders,
      new BigNumber(feePercentage),
      feeRecipient,
      {}
    );
  }

  @time
  async marketSellEth(orders, feeOrders, feePercentage, feeRecipient, amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    return await wrappers.forwarder.marketSellOrdersWithEthAsync(
      orders,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      new BigNumber(amount),
      feeOrders,
      new BigNumber(feePercentage),
      feeRecipient,
      {}
    );
  }
}
