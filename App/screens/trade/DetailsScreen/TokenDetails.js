import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {UNLOCKED_AMOUNT, ZERO} from '../../../../constants';
import {connect as connectNavigation} from '../../../../navigation';
import {styles} from '../../../../styles';
import {addressProp, BigNumberProp} from '../../../../types/props';
import {ConfirmActionErrorSuccessFlow, unlock} from '../../../../thunks';
import MajorText from '../../../components/MajorText';
import withTokenAllowance from '../../../hoc/token/Allowance';
import withExchangeContract from '../../../hoc/uniswap/ExchangeContract';
import Loading from '../../../views/Loading';
import EmptyWallet from './EmptyWallet';
import SwapTokens from './SwapTokens';
import UnlockConfirmation from './UnlockConfirmation';
import UnlockTokenNotice from './UnlockTokenNotice';

class BaseTokenDetails extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool,
      tokenAddress: addressProp,
      ethereumBalance: BigNumberProp,
      tokenAllowance: BigNumberProp,
      exchangeContractAddress: addressProp,
    };
  }

  get isLocked() {
    const {tokenAddress, tokenAllowance} = this.props;
    return UNLOCKED_AMOUNT.isGreaterThan(tokenAllowance);
  }

  componentDidMount() {
    this.unlock();
  }

  componentDidUpdate() {
    this.unlock();
  }

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    const {
      exchangeContractAddress,
      tokenAddress,
      tokenAllowance,
      ethereumBalance,
    } = this.props;

    if (ZERO.isEqualTo(ethereumBalance)) {
      return <EmptyWallet />;
    }

    if (this.isLocked) {
      return <UnlockTokenNotice tokenAddress={tokenAddress} />;
    }

    return (
      <SafeAreaView style={[styles.h100, styles.w100, styles.flex1]}>
        <SwapTokens tokenAddress={tokenAddress} />
      </SafeAreaView>
    );
  }

  unlock = () => {
    if (this.props.loading || !this.isLocked) return;

    const {exchangeContractAddress, tokenAddress} = this.props;
    const action = async () =>
      this.props.dispatch(unlock(tokenAddress, exchangeContractAddress));
    const actionOptions = {
      action,
      icon: <Entypo name="lock" size={100} />,
      label: <MajorText>Unlocking...</MajorText>,
    };
    const confirmationOptions = {
      label: <UnlockConfirmation tokenAddress={tokenAddress} />,
    };
    this.props.dispatch(
      ConfirmActionErrorSuccessFlow(
        this.props.navigation.componentId,
        confirmationOptions,
        actionOptions,
        <Text>
          Unlock transaction successfully sent to the Ethereum network. It takes
          a few minutes for Ethereum to confirm the transaction.
        </Text>,
      ),
    );
  };
}

function extractProps(state, props) {
  const {
    wallet: {balances, allowances},
    settings: {gasPrice},
  } = state;
  const {tokenAddress, exchangeContractAddress} = props;
  const ethereumBalance = balances[null];
  const tokenAllowances =
    allowances[tokenAddress ? tokenAddress.toLowerCase() : null];

  let tokenAllowance = ZERO;

  if (exchangeContractAddress && tokenAllowances) {
    tokenAllowance = tokenAllowances[exchangeContractAddress.toLowerCase()];
  }

  return {
    ethereumBalance,
    tokenAllowance,
    gasPrice,
  };
}

let TokenDetails = connectNavigation(BaseTokenDetails);
TokenDetails = connect(
  extractProps,
  dispatch => ({dispatch}),
)(TokenDetails);
TokenDetails = withTokenAllowance(
  TokenDetails,
  'tokenAllowance',
  'tokenAddress',
  'exchangeContractAddress',
);
TokenDetails = withExchangeContract(TokenDetails);

export default TokenDetails;
