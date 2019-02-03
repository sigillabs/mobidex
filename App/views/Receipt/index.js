import { BigNumber } from '0x.js';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SectionList } from 'react-native';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import * as AssetService from '../../../services/AssetService';
import * as WalletService from '../../../services/WalletService';
import { formatAmount } from '../../../utils';
import ReceiptItem from './ReceiptItem';
import SectionHeader from './SectionHeader';

class BaseReceipt extends Component {
  static get propTypes() {
    const datumProp = PropTypes.shape({
      denomination: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.string.isRequired,
      profit: PropTypes.bool,
      loss: PropTypes.bool
    });
    const dataProp = PropTypes.arrayOf(datumProp);
    const sectionDataProp = PropTypes.shape({
      title: PropTypes.string.isRequired,
      data: dataProp
    });

    return {
      gas: PropTypes.instanceOf(BigNumber).isRequired,
      gasPrice: PropTypes.instanceOf(BigNumber).isRequired,
      value: PropTypes.instanceOf(BigNumber),
      extraWalletData: dataProp,
      extraNetworkData: dataProp,
      extraUpdatedWalletData: dataProp,
      extraSections: PropTypes.arrayOf(sectionDataProp),
      showWallet: PropTypes.bool,
      showNetwork: PropTypes.bool,
      showUpdatedWallet: PropTypes.bool
    };
  }

  static get defaultProps() {
    return {
      gas: ZERO,
      showWallet: true,
      showNetwork: true,
      showUpdatedWallet: true
    };
  }

  render() {
    const { gas, gasPrice } = this.props;
    const networkFeeAsset = AssetService.getNetworkFeeAsset();
    const networkFeeFunds = WalletService.getBalanceByAssetData(
      networkFeeAsset.assetData
    );
    const networkFee = this.getTotalGasCost();
    const value = Web3Wrapper.toUnitAmount(this.props.value || ZERO, 18);

    const wallet = {
      title: 'Wallet',
      data: [
        {
          value: formatAmount(networkFeeFunds, 9),
          denomination: networkFeeAsset.symbol
        }
      ]
    };
    const network = {
      title: 'Network',
      data: [
        { value: formatAmount(gas, 9), denomination: 'GAS' },
        {
          name: 'Gas Price',
          value: formatAmount(Web3Wrapper.toUnitAmount(gasPrice, 9), 9),
          denomination: 'GWEI'
        },
        {
          name: 'Fee',
          value: formatAmount(networkFee, 9),
          denomination: networkFeeAsset.symbol,
          loss: networkFee.gt(0)
        },
        {
          name: 'Value',
          value: formatAmount(value, 9),
          denomination: networkFeeAsset.symbol,
          loss: value.gt(0)
        }
      ]
    };
    const updatedWallet = {
      title: 'Wallet After Transaction',
      data: [
        {
          value: formatAmount(networkFeeFunds.sub(networkFee).sub(value), 9),
          denomination: networkFeeAsset.symbol,
          loss: networkFee.gt(0)
        }
      ]
    };

    if (this.props.extraWalletData) {
      wallet.data = wallet.data.concat(this.props.extraWalletData);
    }

    if (this.props.extraNetworkData) {
      network.data = network.data.concat(this.props.extraNetworkData);
    }

    if (this.props.extraUpdatedWalletData) {
      updatedWallet.data = updatedWallet.data.concat(
        this.props.extraUpdatedWalletData
      );
    }

    let sections = [];
    if (this.props.showWallet) {
      sections = sections.concat([wallet]);
    }
    if (this.props.extraSections) {
      sections = sections.concat(this.props.extraSections);
    }
    if (this.props.showNetwork) {
      sections = sections.concat([network]);
    }
    if (this.props.showUpdatedWallet) {
      sections = sections.concat([updatedWallet]);
    }

    return (
      <SectionList
        sections={sections}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
      />
    );
  }

  keyExtractor = (item, index) => index;

  renderItem = ({ item, index }) => (
    <ReceiptItem
      {...item}
      name={item.name}
      value={item.value.toString()}
      denomination={item.denomination}
      index={index}
    />
  );

  renderSectionHeader = ({ section: { title } }) => (
    <SectionHeader title={title} />
  );

  getTotalGasCost = () => {
    const { gasPrice, gas } = this.props;
    if (gas === null || gas === undefined) {
      return ZERO;
    }
    return Web3Wrapper.toUnitAmount(gasPrice.mul(gas), 18);
  };
}

export default connect(({ wallet: { web3 }, settings: { gasPrice } }) => ({
  web3,
  gasPrice
}))(BaseReceipt);
