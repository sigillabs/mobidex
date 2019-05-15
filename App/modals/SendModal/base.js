import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import { connect as connectNavigation } from '../../../navigation';
import { WalletService } from '../../../services/WalletService';
import {
  ReceiptActionErrorSuccessFlow,
  sendEther,
  sendTokens
} from '../../../thunks';
import { navigationProp } from '../../../types/props';
import { formatAmount } from '../../../lib/utils';
import AmountPage from './AmountPage';
import AccountPage from './AccountPage';

class BaseSendScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      asset: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: ZERO,
      address: '',
      page: 0
    };
  }

  render() {
    const { asset } = this.props;

    switch (this.state.page) {
      case 0:
        return (
          <AmountPage
            asset={asset}
            onPrevious={this.cancel}
            onNext={this.submitAmount}
          />
        );
      case 1:
        return (
          <AccountPage
            asset={asset}
            amount={this.state.amount}
            onPrevious={this.previous}
            onNext={this.submitAddress}
          />
        );
    }
  }

  cancel = () => this.props.navigation.dismissModal();

  previous = () => this.setState({ page: 0 });

  submitAmount = amount =>
    this.setState({
      amount: amount ? new BigNumber(amount) : ZERO,
      page: 1
    });

  submitAddress = address => {
    this.setState({ address });
    this.submit(address);
  };

  submit = async address => {
    const { asset } = this.props;
    const { amount } = this.state;
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(amount, asset.decimals);

    // this.props.dispatch(
    //   ActionErrorSuccessFlow(
    //     this.props.navigation.componentId,
    //     {
    //       action: async () => {
    //         if (asset.address === null) {
    //           await this.props.dispatch(
    //             sendEther(address || this.state.address, this.state.amount)
    //           );
    //         } else {
    //           await this.props.dispatch(
    //             sendTokens(
    //               asset,
    //               address || this.state.address,
    //               this.state.amount
    //             )
    //           );
    //         }
    //       },
    //       icon: <FontAwesome name="send" size={100} />,
    //       label: `Sending ${asset.name}...`
    //     },
    //     `Sent ${asset.name}`,
    //     () => this.props.navigation.dismissModal()
    //   )
    // );

    const {
      extraWalletData,
      extraUpdatedWalletData,
      extraSections,
      gas,
      action,
      value
    } =
      asset.address === null
        ? await this.getSendEtherReceiptProps(address)
        : await this.getSendTokenReceiptProps(address);

    this.props.dispatch(
      ReceiptActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          gas,
          value,
          extraWalletData,
          extraUpdatedWalletData,
          extraSections
        },
        {
          action,
          icon: <FontAwesome name="send" size={100} />,
          label: `Sending ${asset.name}...`
        },
        `Sent ${asset.name}`,
        () => this.props.navigation.dismissModal()
      )
    );
  };

  async getSendEtherReceiptProps(address) {
    const { asset } = this.props;
    const { amount } = this.state;
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(amount, asset.decimals);

    const to = address || this.state.address;
    const extraWalletData = [];
    const extraUpdatedWalletData = [];
    const extraSections = [];
    const gas = await WalletService.instance.estimateEthSend();
    const action = () => this.props.dispatch(sendEther(to, amount));
    const value = baseUnitAmount;

    return {
      to,
      extraWalletData,
      extraUpdatedWalletData,
      extraSections,
      gas,
      action,
      value
    };
  }

  async getSendTokenReceiptProps(address) {
    const { asset } = this.props;
    const { amount } = this.state;
    const baseUnitAmount = Web3Wrapper.toBaseUnitAmount(amount, asset.decimals);
    const balance = await WalletService.instance.getBalanceByAssetData(
      asset.assetData
    );

    const to = address || this.state.address;
    const extraWalletData = [
      {
        denomination: asset.symbol,
        value: formatAmount(balance, 9)
      }
    ];
    const extraUpdatedWalletData = [
      {
        denomination: asset.symbol,
        value: formatAmount(balance.sub(amount), 9)
      }
    ];
    const extraSections = [
      {
        title: 'Transfering',
        data: [
          {
            name: 'Amount',
            value: formatAmount(amount, 9),
            denomination: asset.symbol,
            loss: true
          }
        ]
      }
    ];
    const gas = await WalletService.instance.estimateTokenSend(
      asset.address,
      to,
      baseUnitAmount
    );
    const action = () => this.props.dispatch(sendTokens(asset, to, amount));
    const value = ZERO;

    return {
      to,
      extraWalletData,
      extraUpdatedWalletData,
      extraSections,
      gas,
      action,
      value
    };
  }
}

export default connect(
  state => ({ ...state }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseSendScreen));
