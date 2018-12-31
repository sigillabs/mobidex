import {
  BigNumber,
  ContractWrappers,
  generatePseudoRandomSalt,
  SignerType,
  signatureUtils
} from '0x.js';
import ethUtil from 'ethereumjs-util';
import { ContractDefinitionLoader } from 'web3-contracts-loader';
import EthereumClient from '../clients/ethereum';
import { cache, time } from '../decorators/cls';
import {
  convertBigNumberToHexString,
  convertOrderBigNumberFieldsToHexStrings,
  filterFillableOrders
} from '../utils/orders';

const MembershipABI = require('../abi/Membership.json');

export default class ZeroExClient {
  static ORDER_FIELDS = [
    'exchangeAddress',
    'expirationTimeSeconds',
    'feeRecipientAddress',
    'makerAddress',
    'makerAssetAmount',
    'makerAssetData',
    'makerFee',
    'salt',
    'senderAddress',
    'signature',
    'takerAddress',
    'takerAssetAmount',
    'takerAssetData',
    'takerFee'
  ];
  static MEMBERSHIP_CONTRACT = null;

  constructor(ethereumClient, options = {}) {
    this.ethereumClient = ethereumClient;
    this.options = options;
  }

  @time
  static getMembershipContractAddress(networkId) {
    return MembershipABI.networks[networkId]
      ? MembershipABI.networks[networkId].address
      : null;
  }

  @time
  async getMembershipContract() {
    if (!ZeroExClient.MEMBERSHIP_CONTRACT) {
      const web3 = this.ethereumClient.getWeb3();
      const ethereumClient = new EthereumClient(web3);
      const account = await ethereumClient.getAccount();
      ZeroExClient.MEMBERSHIP_CONTRACT = ContractDefinitionLoader({
        web3,
        contractDefinitions: {
          Membership: {
            ...MembershipABI
          }
        },
        options: {
          from: account
        }
      }).Membership;
    }

    return ZeroExClient.MEMBERSHIP_CONTRACT;
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
  async approveValidatorContract(address) {
    const account = await this.ethereumClient.getAccount();
    const wrappers = await this.getContractWrappers();
    return wrappers.exchange.setSignatureValidatorApprovalAsync(
      address,
      true,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: false }
    );
  }

  @time
  async signOrderHash(orderHash) {
    const account = await this.ethereumClient.getAccount();
    return signatureUtils.ecSignOrderHashAsync(
      this.ethereumClient.getCurrentProvider(),
      orderHash,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      SignerType.Default
    );
  }

  @time
  async depositEther(amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const WETHAddress = await this.getWETHTokenAddress(true);
    return wrappers.etherToken.depositAsync(
      WETHAddress,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async withdrawEther(amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const WETHAddress = await this.getWETHTokenAddress(true);
    return wrappers.etherToken.withdrawAsync(
      WETHAddress,
      new BigNumber(amount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
    );
  }

  @time
  async fillOrKillOrder(order, amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    return wrappers.exchange.fillOrKillOrderAsync(
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
    return wrappers.exchange.batchFillOrKillOrdersAsync(
      orders,
      amounts.map(amount => new BigNumber(amount)),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      { shouldValidate: false }
    );
  }

  @time
  async cancelOrder(order) {
    const wrappers = await this.getContractWrappers();
    return wrappers.exchange.cancelOrderAsync(order, {
      shouldValidate: false
    });
  }

  @time
  async marketBuy(orders, amount) {
    const membershipContract = await this.getMembershipContract();
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const fillableOrders = await filterFillableOrders(wrappers, orders);

    if (fillableOrders.length === 0) {
      throw new Error(
        'There are no more valid orders to fill. Sometimes this happens when there are several invalid orders stored in the orderbook.'
      );
    }

    const signatures = fillableOrders.map(order => order.signature);

    return membershipContract.methods
      .marketBuyOrdersForMembers(
        fillableOrders.map(convertOrderBigNumberFieldsToHexStrings),
        convertBigNumberToHexString(amount),
        convertBigNumberToHexString(generatePseudoRandomSalt()),
        signatures
      )
      .send({
        ...this.options,
        from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
      });
  }

  @time
  async marketSell(orders, amount) {
    const membershipContract = await this.getMembershipContract();
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const fillableOrders = await filterFillableOrders(wrappers, orders);

    if (fillableOrders.length === 0) {
      throw new Error(
        'There are no more valid orders to fill. Sometimes this happens when there are several invalid orders stored in the orderbook.'
      );
    }

    const signatures = fillableOrders.map(order => order.signature);
    console.warn(JSON.stringify(fillableOrders));

    return membershipContract.methods
      .marketSellOrdersForMembers(
        fillableOrders.map(convertOrderBigNumberFieldsToHexStrings),
        convertBigNumberToHexString(amount),
        convertBigNumberToHexString(generatePseudoRandomSalt()),
        signatures
      )
      .send({
        ...this.options,
        from: `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`
      });
  }

  @time
  async marketBuyWithEth(
    orders,
    feeOrders,
    feePercentage,
    feeRecipient,
    makerAmount,
    ethAmount
  ) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    const fillableOrders = await filterFillableOrders(wrappers, orders);
    const fillableFeeOrders = await filterFillableOrders(wrappers, feeOrders);

    if (fillableOrders.length === 0) {
      throw new Error(
        'There are no more valid orders to fill. Sometimes this happens when there are several invalid orders stored in the orderbook.'
      );
    }

    return wrappers.forwarder.marketBuyOrdersWithEthAsync(
      fillableOrders,
      new BigNumber(makerAmount),
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      new BigNumber(ethAmount),
      fillableFeeOrders,
      feePercentage,
      feeRecipient,
      this.options
    );
  }

  @time
  async marketSellEth(orders, feeOrders, feePercentage, feeRecipient, amount) {
    const wrappers = await this.getContractWrappers();
    const account = await this.ethereumClient.getAccount();
    return wrappers.forwarder.marketSellOrdersWithEthAsync(
      orders,
      `0x${ethUtil.stripHexPrefix(account.toString().toLowerCase())}`,
      new BigNumber(amount),
      feeOrders,
      feePercentage,
      feeRecipient,
      this.options
    );
  }
}
