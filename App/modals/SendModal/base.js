import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {ZERO} from '../../../constants';
import {connect as connectNavigation} from '../../../navigation';
import * as AssetService from '../../../services/AssetService';
import {GasService} from '../../../services/GasService';
import {WalletService} from '../../../services/WalletService';
import {
  ConfirmActionErrorSuccessFlow,
  sendEther,
  sendTokens,
} from '../../../thunks';
import {addressProp, navigationProp} from '../../../types/props';
import {formatAmount} from '../../../lib/utils';
import MajorText from '../../components/MajorText';
import AmountPage from './AmountPage';
import AccountPage from './AccountPage';
import SendConfirmation from './SendConfirmation';

class BaseSendScreen extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      tokenAddress: addressProp.isRequired,
      dispatch: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: ZERO,
      address: '',
      page: 0,
    };
  }

  render() {
    const {tokenAddress} = this.props;

    switch (this.state.page) {
      case 0:
        return (
          <AmountPage
            tokenAddress={tokenAddress}
            onPrevious={this.cancel}
            onNext={this.submitAmount}
          />
        );
      case 1:
        return (
          <AccountPage
            tokenAddress={tokenAddress}
            amount={this.state.amount}
            onPrevious={this.previous}
            onNext={this.submitAddress}
          />
        );
    }
  }

  cancel = () => this.props.navigation.dismissModal();

  previous = () => this.setState({page: 0});

  submitAmount = (amount) =>
    this.setState({
      amount: amount ? new BigNumber(amount) : ZERO,
      page: 1,
    });

  submitAddress = (address) => {
    this.setState({address});
    this.submit(address);
  };

  submit = async (address) => {
    const {tokenAddress, gasPrice} = this.props;
    const {amount} = this.state;
    const asset = AssetService.findAssetByAddress(tokenAddress);

    let sendAction, gas;
    if (AssetService.isEthereum(tokenAddress)) {
      sendAction = sendEther;
      gas = await GasService.instance.EthereumSend();
    } else {
      sendAction = (to, amount) => sendTokens(tokenAddress, to, amount);
      gas = await GasService.instance.TokenTransfer(
        tokenAddress,
        address,
        amount,
      );
    }

    const action = async () => this.props.dispatch(sendAction(address, amount));
    const actionOptions = {
      action,
      icon: <FontAwesome name="send" size={100} />,
      label: <MajorText>Sending...</MajorText>,
    };
    const confirmationOptions = {
      label: (
        <SendConfirmation
          tokenAddress={tokenAddress}
          to={address}
          amount={amount}
          gas={gas}
          gasPrice={gasPrice}
        />
      ),
    };
    this.props.dispatch(
      ConfirmActionErrorSuccessFlow(
        this.props.navigation.componentId,
        confirmationOptions,
        actionOptions,
        <Text>
          Send transaction successfully sent to the Ethereum network. It takes a
          few minutes for Ethereum to confirm the transaction.
        </Text>,
      ),
    );
  };
}

export default connect(
  ({settings: {gasPrice}}) => ({gasPrice}),
  (dispatch) => ({dispatch}),
)(connectNavigation(BaseSendScreen));
