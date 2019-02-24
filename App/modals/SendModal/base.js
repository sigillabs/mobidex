import { Web3Wrapper } from '@0xproject/web3-wrapper';
import { BigNumber } from '0x.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { ZERO } from '../../../constants/0x';
import { connect as connectNavigation } from '../../../navigation';
import * as WalletService from '../../../services/WalletService';
import {
  ActionErrorSuccessFlow,
  ReceiptActionErrorSuccessFlow,
  sendEther,
  sendTokens
} from '../../../thunks';
import { navigationProp } from '../../../types/props';
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

    const to = address || this.state.address;
    let gas = null;
    if (asset.address === null) {
      gas = await WalletService.estimateEthSend();
    } else {
      gas = await WalletService.estimateTokenSend(
        asset.address,
        to,
        baseUnitAmount
      );
    }

    this.props.dispatch(
      ReceiptActionErrorSuccessFlow(
        this.props.navigation.componentId,
        {
          gas,
          value: asset.address === null ? baseUnitAmount : undefined
        },
        {
          action: async () => {
            if (asset.address === null) {
              await this.props.dispatch(sendEther(to, amount));
            } else {
              await this.props.dispatch(sendTokens(asset, to, amount));
            }
          },
          icon: <FontAwesome name="send" size={100} />,
          label: `Sending ${asset.name}...`
        },
        `Sent ${asset.name}`,
        () => this.props.navigation.dismissModal()
      )
    );
  };
}

export default connect(
  state => ({ ...state }),
  dispatch => ({ dispatch })
)(connectNavigation(BaseSendScreen));
