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

const style = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    flex: 0,
  },
});

class BaseUnwrapETH extends Component {
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
      return null;
    }

    const ETHUnitBalance = ethereumBalance.dividedBy(TEN.pow(18));
    const WETHUnitBalance = WETHBalance.dividedBy(TEN.pow(18));
    const border = ETHUnitBalance.plus(WETHUnitBalance);

    let wei = TEN.pow(18)
      .times(value)
      .integerValue();
    if (wei.isGreaterThan(ethereumBalance)) {
      wei = ethereumBalance;
    }
    const updatedEthereumBalance = ethereumBalance.minus(wei);
    const updatedWETHBalance = WETHBalance.plus(wei);

    return (
      <React.Fragment>
        <View style={[styles.flex1]}>
          <View style={style.container}>
            <AssetIcon
              amount={updatedEthereumBalance}
              avatarProps={{size: 100}}
              labelProps={{style: [fonts.large]}}
              amountProps={{style: [fonts.large]}}
            />
          </View>
          <Row style={[styles.center, styles.w100, styles.mv3]}>
            <View style={styles.textCenter}>
              <AssetIcon
                avatarProps={{size: 50}}
                showAmount={false}
                showName={false}
                showSymbol={false}
              />
            </View>
            <View style={(styles.textCenter, styles.mh3)}>
              <Slider
                style={[styles.w100]}
                value={this.state.value}
                minimumValue={0}
                maximumValue={border.toNumber()}
                step={0.0001}
                onValueChange={value => this.setState({value})}
              />
              <Row
                style={StyleSheet.flatten([
                  styles.center,
                  styles.textCenter,
                  styles.w100,
                ])}>
                <Entypo
                  name="swap"
                  size={15}
                  color="black"
                  style={styles.mr1}
                />
                <EthereumAmount amount={ethereumBalance} unit={'ether'} />
                <Text> </Text>
                <FormattedSymbol address={null} />
              </Row>
            </View>
            <View style={styles.textCenter}>
              <AssetIcon
                address={WETHAddress}
                avatarProps={{size: 50}}
                showAmount={false}
                showName={false}
                showSymbol={false}
              />
            </View>
          </Row>
          <View style={style.container}>
            <AssetIcon
              address={WETHAddress}
              amount={updatedWETHBalance}
              avatarProps={{size: 100}}
              labelProps={{style: [fonts.large]}}
              amountProps={{style: [fonts.large]}}
            />
          </View>
        </View>

        <View style={[styles.flex0]}>
          <Button title={'Unwrap'} onPress={this.onUnwrap} />
        </View>
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

let UnwrapETH = connectNavigation(BaseUnwrapETH);
UnwrapETH = connect(
  extractProps,
  dispatch => ({dispatch}),
)(UnwrapETH);

export default UnwrapETH;
