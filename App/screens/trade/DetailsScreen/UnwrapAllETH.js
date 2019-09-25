import * as _ from 'lodash';
import {BigNumber} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from 'react-native-elements';
import {connect} from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import FA from 'react-native-vector-icons/FontAwesome';
import {ZERO, TEN} from '../../../../constants';
import {bigIntToEthHex} from '../../../../lib/utils';
import {connect as connectNavigation} from '../../../../navigation';
import {styles, fonts} from '../../../../styles';
import {navigationProp, BigNumberProp} from '../../../../types/props';
import {
  ConfirmActionErrorSuccessFlow,
  loadBalance,
  refreshGasPrice,
  unwrapAllETH,
} from '../../../../thunks';
import Button from '../../../components/Button';
import EthereumAmount from '../../../components/EthereumAmount';
import AssetIcon from '../../../components/EthereumIcon';
import FormattedSymbol from '../../../components/FormattedSymbol';
import MajorText from '../../../components/MajorText';
import Row from '../../../components/Row';
import Loading from '../../../views/Loading';
import UnwrapConfirmation from './UnwrapConfirmation';

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class BaseWrapETH extends Component {
  static get propTypes() {
    return {
      navigation: navigationProp.isRequired,
      ethereumBalance: BigNumberProp.isRequired,
      gasPrice: BigNumberProp.isRequired,
      WETHAddress: PropTypes.string.isRequired,
      WETHBalance: BigNumberProp.isRequired,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.value === null && props.WETHBalance) {
      return {
        ...state,
        value: props.WETHBalance.dividedBy(TEN.pow(18)).toNumber(),
      };
    }

    return state;
  }

  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  async componentDidMount() {
    await Promise.all([
      this.props.dispatch(loadBalance(null)),
      this.props.dispatch(loadBalance(this.props.WETHAddress)),
      this.props.dispatch(refreshGasPrice()),
    ]);
  }

  render() {
    const {ethereumBalance, WETHBalance, WETHAddress} = this.props;
    const {value} = this.state;

    if (!ethereumBalance || !WETHBalance) {
      return <Loading />;
    }

    return (
      <React.Fragment>
        <View style={[styles.flex1, style.container]}>
          <AssetIcon
            amount={ethereumBalance}
            avatarProps={{size: 50}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
        </View>
        {!ZERO.isEqualTo(WETHBalance) ? (
          <View style={[styles.flex0]}>
            <Button
              title={'Unwrap'}
              onPress={this.onUnwrap}
              disabled={this.state.value === 0}
            />
          </View>
        ) : null}
      </React.Fragment>
    );
  }

  onUnwrap = () => {
    const {tokenAddress, exchangeContractAddress} = this.props;
    const action = async () => this.props.dispatch(unwrapAllETH());
    const actionOptions = {
      action,
      icon: <FA name="money" size={100} />,
      label: <MajorText>Unwrapping...</MajorText>,
    };
    const confirmationOptions = {
      label: <UnwrapConfirmation />,
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
    settings: {
      gasPrice,
      weth9: {address: WETHAddress},
    },
  } = state;
  const {tokenAddress} = props;

  return {
    WETHAddress,
    ethereumBalance: balances[null] ? new BigNumber(balances[null]) : ZERO,
    WETHBalance: balances[WETHAddress]
      ? new BigNumber(balances[WETHAddress])
      : ZERO,
    gasPrice,
  };
}

let WrapETH = connectNavigation(BaseWrapETH);
WrapETH = connect(
  extractProps,
  dispatch => ({dispatch}),
)(WrapETH);

export default WrapETH;
