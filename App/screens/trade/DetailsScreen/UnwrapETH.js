import {
  tradeExactEthForTokens,
  tradeExactTokensForEth,
  getExecutionDetails,
} from '@uniswap/sdk';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import FA from 'react-native-vector-icons/FontAwesome';
import {
  ETH_TO_TOKEN_SWAP_INPUT_GAS,
  TEN,
  TOKEN_TO_ETH_SWAP_INPUT_GAS,
  UNLOCKED_AMOUNT,
} from '../../../../constants';
import {bigIntToEthHex} from '../../../../lib/utils';
import {
  connect as connectNavigation,
  showErrorModal,
} from '../../../../navigation';
import * as AssetService from '../../../../services/AssetService';
import {styles, fonts} from '../../../../styles';
import {
  navigationProp,
  MarketDetailsProp,
  BigNumberProp,
} from '../../../../types/props';
import {ConfirmActionErrorSuccessFlow, unwrapAllETH} from '../../../../thunks';
import withMarketDetails from '../../../hoc/uniswap/MarketDetails';
import withExchangeContract from '../../../hoc/uniswap/ExchangeContract';
import withEthereumBalance from '../../../hoc/ethereum/Balance';
import withTokenBalance from '../../../hoc/token/Balance';
import BigCenter from '../../../components/BigCenter';
import Button from '../../../components/Button';
import EthereumAmount from '../../../components/EthereumAmount';
import EthereumIcon from '../../../components/EthereumIcon';
import FormattedPercent from '../../../components/FormattedPercent';
import FormattedSymbol from '../../../components/FormattedSymbol';
import MajorText from '../../../components/MajorText';
import Row from '../../../components/Row';
import TokenIcon from '../../../components/TokenIcon';
import TradeConfirmation from './TradeConfirmation';

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
      gasPrice: BigNumberProp.isRequired,
      WETHAddress: PropTypes.string.isRequired,
    };
  }

  render() {
    const {ethereumBalance, WETHBalance, WETHAddress} = this.props;

    return (
      <React.Fragment>
        <View style={style.container}>
          <EthereumIcon
            address={tokenAddress}
            amount={updatedEthereumBalance}
            avatarProps={{size: 100}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
        </View>
        <Row style={[styles.center, styles.w100, styles.mv3]}>
          <View style={styles.textCenter}>
            <EthereumIcon
              address={tokenAddress}
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
              minimumValue={-1}
              maximumValue={1}
              step={0.01}
              onValueChange={value => this.setState({value})}
            />
            <Row
              style={StyleSheet.flatten([
                styles.center,
                styles.textCenter,
                styles.w100,
              ])}>
              <Entypo name="swap" size={15} color="black" style={styles.mr1} />
              <EthereumAmount amount={this.price} unit={'ether'} />
              <Text> </Text>
              <FormattedSymbol address={null} />
            </Row>
          </View>
          <View style={styles.textCenter}>
            <TokenIcon
              address={WETHAddress}
              avatarProps={{size: 50}}
              showAmount={false}
              showName={false}
              showSymbol={false}
            />
          </View>
        </Row>
        <View style={style.container}>
          <TokenIcon
            address={WETHAddress}
            amount={updatedWETHBalance}
            avatarProps={{size: 100}}
            labelProps={{style: [fonts.large]}}
            amountProps={{style: [fonts.large]}}
          />
        </View>

        <Button title={'Unlock'} onPress={this.onUnwrap} />
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

const SwapTokens = connectNavigation(BaseUnwrapETH);

export default SwapTokens;
