import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {SafeAreaView, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {connect} from 'react-redux';
import {UNLOCKED_AMOUNT, ZERO} from '../../../../constants';
import {connect as connectNavigation} from '../../../../navigation';
import * as AssetService from '../../../../services/AssetService';
import {styles} from '../../../../styles';
import {addressProp, BigNumberProp} from '../../../../types/props';
import Loading from '../../../views/Loading';
import EmptyWallet from './EmptyWallet';
import SwapTokens from './SwapTokens';
import UnwrapAllETH from './UnwrapAllETH';
import UnlockConfirmation from './UnlockConfirmation';
import UnlockTokenNotice from './UnlockTokenNotice';

class BaseEthereumDetails extends Component {
  static get propTypes() {
    return {
      loading: PropTypes.bool,
      ethereumBalance: BigNumberProp,
    };
  }

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    const {ethereumBalance} = this.props;

    if (ZERO.isEqualTo(ethereumBalance)) {
      return <EmptyWallet />;
    }

    return (
      <SafeAreaView style={[styles.h100, styles.w100, styles.flex1]}>
        <UnwrapAllETH />
      </SafeAreaView>
    );
  }
}

function extractProps(state, props) {
  const {
    wallet: {balances},
    settings: {gasPrice},
  } = state;
  const ethereumBalance = balances[null];

  return {
    ethereumBalance,
    gasPrice,
  };
}

let EthereumDetails = connectNavigation(BaseEthereumDetails);
EthereumDetails = connect(
  extractProps,
  dispatch => ({dispatch}),
)(EthereumDetails);

export default EthereumDetails;
